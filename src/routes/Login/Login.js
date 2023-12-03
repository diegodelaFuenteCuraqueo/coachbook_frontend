// src/components/Login.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { URL } from '../../constants'
import '../../App.css'
import Navbar from '../../components/NavBar'

const apiUrl = URL.LOCALHOST + URL.API.login

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
      const response = await axios.post(apiUrl, { email, password })
      console.log('Login response:', response.data)
      console.log('isAuthenticated:', isAuthenticated)
      //setToken(response.data.token)
      //setUser(response.data.userPayload.id)
      login(response.data)
      navigate(`/home`)
    } catch (error) {
      setLogMessage(error.response?.data?.message)
      console.error('Login failed:', error)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container login-form-container">
        <h1 className="login-form-title">Iniciar sesión</h1>
        <div className="login-input-container">
          <input
            className="login-input-field"
            type="text"
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

        <div className="login-input-container">
          <button className="btn btn-secondary" onClick={() => { navigate('/register') }}>Registrarse</button>
        </div>

      </div>
    </>
  )
}

export default Login
