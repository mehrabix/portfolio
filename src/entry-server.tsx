import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import './index.css' // Import CSS for SSR

export function render(url: string) {
  const html = renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )

  return { html }
} 