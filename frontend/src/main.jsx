import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BootOrchestrator from './BootOrchestrator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BootOrchestrator />
  </StrictMode>,
)
