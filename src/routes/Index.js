// src/App.js
import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './Login'
import RegisterPage from './Register'
import HomePage from './Home'
import PickTimeBlockPage from './PickTimeBlock'
import Inicio from './Inicio'
import ChangePasswordPage from './ChangePassword'
import { useAuth } from '../context/AuthContext'
import EditTimeBlockPage from './EditTimeBlock'

function Pages() {
  const { isAuthenticated, user } = useAuth()

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={ <LoginPage />} />
        <Route path="/inicio" element={ <Inicio />} />
        <Route path="/login" element={ isAuthenticated ? <HomePage /> : <LoginPage /> } />
        <Route path="/register" element={ isAuthenticated && user?.usertype !== "client" ? <RegisterPage /> : <HomePage /> } />
        <Route path="/home" element={ isAuthenticated ? <HomePage /> : <LoginPage /> } />
        <Route path="/pick-timeblock" element={ isAuthenticated ? <PickTimeBlockPage /> : <LoginPage /> } />
        <Route path="/edit-timeblock" element={ isAuthenticated ? <EditTimeBlockPage /> : <LoginPage /> } />
        <Route path="/change-password" element={ isAuthenticated ? <ChangePasswordPage /> : <LoginPage /> } />
        <Route path="*" element={ <LoginPage />} />
      </Routes>
    </Router>
  )
}

export default Pages
