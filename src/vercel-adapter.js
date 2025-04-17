// This adapter helps make your SSR app compatible with Vercel's serverless environment
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export async function renderOnVercel(render, url, req, res) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    
    // Determine if we're in a Vercel production environment
    const isVercelProd = process.env.VERCEL_ENV === 'production'
    
    // Base directory for assets
    const baseDir = isVercelProd ? './' : '../'
    
    // Load the pre-built template
    const templatePath = path.resolve(__dirname, `${baseDir}dist/index.html`)
    const template = fs.readFileSync(templatePath, 'utf-8')
    
    // Get CSS from dist directory
    let cssToInject = ''
    const cssDir = path.resolve(__dirname, `${baseDir}dist/assets`)
    
    try {
      const cssFiles = fs.readdirSync(cssDir)
        .filter(file => file.endsWith('.css'))
      
      for (const file of cssFiles) {
        const cssContent = fs.readFileSync(
          path.resolve(cssDir, file), 
          'utf-8'
        )
        cssToInject += cssContent
      }
    } catch (error) {
      console.warn('Warning: Could not load CSS files', error.message)
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
      .replace('</head>', `${styleTag}</head>`)
    
    return html
  } catch (e) {
    console.error('SSR Error:', e)
    throw e
  }
} 