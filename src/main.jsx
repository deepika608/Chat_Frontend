import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ✅ ADD THIS
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ WRAP HERE */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)