// src/components/HomePage.js
import React, {useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate])

  const username = new URLSearchParams(location.search).get('username')

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <button onClick={() => { navigate('/register') }}>Register</button>
      <button onClick={() => { logout(); navigate('/login') }}>Log out</button>
    </div>
  )
}

export default HomePage
