import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// In production, silence console warnings and errors to reduce noise
if (import.meta.env && import.meta.env.PROD) {
  console.warn = () => {};
  console.error = () => {};
}
import './index.css'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

