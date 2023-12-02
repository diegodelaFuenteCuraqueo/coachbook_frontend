// src/App.js
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from './context/AuthContext'
import Pages from './routes/Index'

function App() {
  return (
    <AuthProvider>
      <Pages />
    </AuthProvider>
  )
}

export default App
