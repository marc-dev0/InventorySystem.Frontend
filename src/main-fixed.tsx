import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// No importar CSS por ahora para debug
// import './index.css'

import App from './App-minimal.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Debug info
console.log('✅ React app iniciado')
console.log('✅ Root element encontrado')
console.log('✅ App component cargado')