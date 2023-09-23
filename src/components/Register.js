// src/components/Register.js
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const apiUrl = 'http://localhost:5000/api/register'

function Register() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("not auth")
      navigate('/login')
    }
  }, [])

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(apiUrl, formData)
      console.log(response.data)
      navigate('/login')
    } catch (error) {
      console.error(error.response.data)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
            value={formData.username}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>
        <div>
          <label htmlFor="email">email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={formData.email}
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register

