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
      let cssToInject = ''

      if (!isProduction) {
        // In development: Use Vite to load and transform HTML
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        
        // Extract CSS from Vite
        const cssModules = await vite.moduleGraph.getModulesByFile(new RegExp('.*\\.css$'))
        if (cssModules) {
          for (const mod of cssModules) {
            if (mod && mod.ssrTransformResult) {
              cssToInject += mod.ssrTransformResult.code
            }
          }
        }
        
        // Load server entry
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        // In production: Load pre-built assets
        template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8')
        
        // Get CSS from dist directory
        const cssFiles = fs.readdirSync(path.resolve(__dirname, 'dist/assets'))
          .filter(file => file.endsWith('.css'))
        
        for (const file of cssFiles) {
          const cssContent = fs.readFileSync(
            path.resolve(__dirname, `dist/assets/${file}`), 
            'utf-8'
          )
          cssToInject += cssContent
        }
        
        render = (await import('./dist/server/entry-server.js')).render
      }

      // Render app to HTML
      const { html: appHtml } = await render(url)

      // Create style tag with extracted CSS
      const styleTag = cssToInject 
        ? `<style type="text/css">${cssToInject}</style>` 
        : '';

      // Inject rendered app and styles into HTML template
      const html = template
        .replace('<!--app-html-->', appHtml)
        .replace('</head>', `${styleTag}</head>`);

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