import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import compression from 'compression'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3000

async function createServer() {
  const app = express()
  
  // Apply compression middleware
  app.use(compression())

  let vite

  if (!isProduction) {
    // In development mode, use Vite's dev server
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  } else {
    // In production, serve static assets
    app.use(
      '/', // Changed from '/portfolio/' to standard root path
      express.static(path.resolve(__dirname, 'dist'))
    )
  }

  app.use('*', async (req, res) => {
    try {
      // Use the original URL directly instead of replacing '/portfolio/'
      const url = req.originalUrl

      let template
      let render

      if (!isProduction) {
        // In development: Use Vite to load and transform HTML
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        
        // Load server entry
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        // In production: Load pre-built assets
        template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8')
        render = (await import('./dist/server/entry-server.js')).render
      }

      // Render app to HTML
      const { html: appHtml } = await render(url)

      // Inject rendered app into HTML template
      const html = template.replace('<!--app-html-->', appHtml)

      // Send rendered HTML to client
      res.status(200)
        .set({ 'Content-Type': 'text/html' })
        .end(html)
    } catch (e) {
      // Handle errors
      vite?.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
}

createServer() 