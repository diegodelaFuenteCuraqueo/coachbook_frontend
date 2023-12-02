// src/App.js
import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './Login'
import RegisterPage from './Register'
import HomePage from './Home'
import CreateTimeBlockPage from './CreateTimeBlock'
import EditTimeBlockPage from './EditTimeBlock'
import PickTimeBlockPage from './PickTimeBlock'
import { useAuth } from '../context/AuthContext'

function Pages() {
  const { isAuthenticated } = useAuth()
  console.log('Pages', isAuthenticated)

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={ <LoginPage />} />
        <Route path="/login" element={ isAuthenticated ? <HomePage /> : <LoginPage /> } />
        <Route path="/register" element={ isAuthenticated ? <RegisterPage /> : <RegisterPage /> } />
        <Route path="/home" element={ isAuthenticated ? <HomePage /> : <LoginPage /> } />
        <Route path="/create-timeblock" element={ isAuthenticated ? <CreateTimeBlockPage /> : <LoginPage /> } />
        <Route path="/edit-timeblock" element={ isAuthenticated ? <EditTimeBlockPage /> : <LoginPage /> } />
        <Route path="/pick-timeblock" element={ isAuthenticated ? <PickTimeBlockPage /> : <LoginPage /> } />
      </Routes>
    </Router>
  )
}

export default Pages
