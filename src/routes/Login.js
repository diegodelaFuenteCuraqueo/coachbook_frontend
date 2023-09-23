// src/components/Login.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const apiUrl = 'http://localhost:5000/api/login'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [logMessage, setLogMessage] = useState('')
  const navigate = useNavigate()

  const { isAuthenticated, login } = useAuth()

  const handleLogin = async () => {
    console.log('Login clicked', { username, password })
    setLogMessage('')
    try {
      const response = await axios.post(apiUrl, { username, password })
      console.log('Login response:', response)
      console.log('isAuthenticated:', isAuthenticated)
      localStorage.setItem('token', response.data.token)
      login()
      navigate(`/home?username=${username}`)
    } catch (error) {
      setLogMessage(error.response.data.message)
      console.error('Login failed:', error)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p style={{ color: 'red' }}>{logMessage}</p>
    </div>
  )
}

export default Login
