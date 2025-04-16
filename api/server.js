import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer as createViteServer } from 'vite'

// Support for Vercel serverless function format
export default async function handler(req, res) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const root = path.join(__dirname, '..')
    const isProduction = process.env.NODE_ENV === 'production'
    
    let template, render

    if (isProduction) {
      // In production mode, use the built HTML and server entry
      template = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf-8')
      
      // Import the server-side entry point
      const serverEntryPath = path.join(root, 'dist/server/entry-server.js')
      const { render: ssrRender } = await import(serverEntryPath)
      render = ssrRender
    } else {
      // In development mode, create Vite dev server
      const vite = await createViteServer({
        root,
        server: { middlewareMode: true },
        appType: 'custom'
      })
      
      // Use Vite to transform HTML
      template = fs.readFileSync(path.join(root, 'index.html'), 'utf-8')
      template = await vite.transformIndexHtml(req.url, template)
      
      // Load server entry point
      render = (await vite.ssrLoadModule(path.join(root, 'src/entry-server.tsx'))).render
    }

    // Render the app HTML
    const { html: appHtml } = await render(req.url)

    // Inject app HTML into the template
    const html = template.replace('<!--app-html-->', appHtml)

    // Return rendered HTML with appropriate headers
    res.setHeader('Content-Type', 'text/html')
    return res.end(html)
  } catch (error) {
    console.error('SSR error:', error)
    res.statusCode = 500
    return res.end('Internal Server Error')
  }
} 