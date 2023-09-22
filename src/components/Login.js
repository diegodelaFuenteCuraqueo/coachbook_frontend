// src/components/Login.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const apiUrl = 'http://localhost:5000/api/login'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await axios.post(apiUrl, { username, password })
      console.log(response)
      navigate(`/home?username=${username}`)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <input type="user" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
