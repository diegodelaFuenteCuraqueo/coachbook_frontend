// src/App.js
import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './routes/Login'
import Register from './routes/Register'
import HomePage from './routes/Home'
import CreateTimeBlock from './routes/CreateTimeBlock'
import EditTimeBlock from './routes/EditTimeBlock'
import { useAuth } from './context/AuthContext'

function Pages() {
  const { isAuthenticated } = useAuth()
  console.log('Pages', isAuthenticated)

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={ <Login />} />
        <Route path="/login" element={ isAuthenticated ? <HomePage /> : <Login /> } />
        <Route path="/register" element={ isAuthenticated ? <Register /> : <Register /> } />
        <Route path="/home" element={ isAuthenticated ? <HomePage /> : <Login /> } />
        <Route path="/create-timeblock" element={ isAuthenticated ? <CreateTimeBlock /> : <Login /> } />
        <Route path="/edit-timeblock" element={ isAuthenticated ? <EditTimeBlock /> : <Login /> } />
      </Routes>
    </Router>
  )
}

export default Pages
