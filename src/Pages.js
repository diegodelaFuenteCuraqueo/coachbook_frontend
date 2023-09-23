// src/App.js
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './routes/Login'
import Register from './routes/Register'
import HomePage from './routes/Home'
import { useAuth } from './context/AuthContext'

function Pages() {
  const { isAuthenticated } = useAuth()
  console.log('Pages', isAuthenticated)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={ isAuthenticated ? <Register /> : <Login /> } />
        <Route path="/home" element={ isAuthenticated ? <HomePage /> : <Login /> } />
      </Routes>
    </Router>
  )
}

export default Pages
