import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WithClerk } from './clerk.tsx'
import { Toaster } from './toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WithClerk>
      <App />
      <Toaster />
    </WithClerk>
  </StrictMode>,
)
