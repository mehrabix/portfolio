import { render } from '../dist/server/entry-server.js'
import { renderOnVercel } from '../src/vercel-adapter.js'

export default async function handler(req, res) {
  try {
    const url = req.url
    
    // Use our Vercel adapter to render the page
    const html = await renderOnVercel(render, url, req, res)
    
    // Send rendered HTML to client
    res.status(200)
      .setHeader('Content-Type', 'text/html')
      .send(html)
  } catch (e) {
    console.error(e)
    res.status(500).send('Server Error: ' + e.message)
  }
} 