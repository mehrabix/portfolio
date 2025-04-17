// This is the main entry point for all Vercel API routes
import serverHandler from './server.js'

export default function handler(req, res) {
  // Pass all requests to our server handler
  return serverHandler(req, res)
} 