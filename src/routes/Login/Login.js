// src/components/Login.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import '../../App.css'
import { getEndpointURL } from '../../utils/getEndpointURL'

const apiUrl = getEndpointURL('login')

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [logMessage, setLogMessage] = useState('')
  const navigate = useNavigate()

  const { isAuthenticated, login } = useAuth()

  const handleLogin = async () => {
    console.log('Login clicked', { email, password })
    setLogMessage('')
    try {
      const response = await axios.post( apiUrl, { email, password })
      login(response.data)
      navigate(`/home`)
    } catch (error) {
      setLogMessage(error.response?.data?.message)
      console.error('Login failed:', error)
    }
  }

  return (
    <>
      <div className="container login-form-container">
        <h1 className="login-form-title">Iniciar sesión</h1>
        <div className="login-input-container">
          <input
            className="login-input-field"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-input-container">
          <input
            className="login-input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-input-container">
          <p style={{ color: 'red' }}>{logMessage}</p>
          <button className="btn btn-primary" onClick={handleLogin}>Iniciar sesión</button>
        </div>
      </div>
    </>
  )
}

export default Login
