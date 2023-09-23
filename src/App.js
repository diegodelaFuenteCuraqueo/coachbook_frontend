// src/App.js
import React from 'react'
import { AuthProvider } from './context/AuthContext'
import Pages from './Pages'

function App() {
  return (
    <AuthProvider>
      <Pages />
    </AuthProvider>
  )
}

export default App
