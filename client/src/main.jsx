import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import App from './App'
import { queryClient } from './lib/queryClient'
import { storageService } from './services/storageService'
import './index.css'

// Force dark mode
document.documentElement.classList.add('dark')

// Sync initial profile state to Chrome extension on startup
try {
  const profile = storageService.getProfile()
  storageService.saveProfile(profile)
} catch (e) {
  console.warn('Failed to auto-sync profile to extension:', e)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster theme="dark" position="top-right" closeButton richColors />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
