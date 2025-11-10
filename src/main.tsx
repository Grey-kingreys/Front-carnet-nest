import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Toaster } from "react-hot-toast"
import { AuthProvider } from './components/Contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false}/>
      <div className='flex justify-center items-center min-h-screen my-5'>
        <App />
      </div>
    </AuthProvider>
  </StrictMode>,
)
