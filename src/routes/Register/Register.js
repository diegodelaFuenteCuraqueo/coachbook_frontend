// src/components/Register.js
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext.js'
import '../../App.css'
import { getEndpointURL } from '../../utils/getEndpointURL'

const apiUrl = getEndpointURL('register')

function Register() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (user.usertype === 'client' || !isAuthenticated) {
      navigate('/home')
    }
  }, [ user, isAuthenticated ])

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    requesterID: user._id,
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
    <>
    <div className="container login-form-container">
      <h1 className="login-form-title"> Nuevo usuario</h1>

      <div className="login-input-container">
        <form onSubmit={handleSubmit}>
          <div className="login-input-container">
            <label className="login-label" htmlFor="username">Nombre de usuario</label>
            <input
              className="login-input-field"
              type="text"
              name="username"
              id="username"
              onChange={handleChange}
              value={formData.username}
              placeholder="Nombre de usuario"
              required
            />
          </div>
          <div className="login-input-container">
            <label className="login-label" htmlFor="password">Password</label>
            <input
              className="login-input-field"
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Password"
              required
            />
          </div>
          <div className="login-input-container">
            <label className="login-label" htmlFor="email">email</label>
            <input
              className="login-input-field"
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={formData.email}
              placeholder="email"
              required
            />
          </div>
          <div className="login-input-container">
            <label className="login-label" htmlFor="usertype">User type</label>
            <select className="login-input-field" name="usertype" id="usertype" onChange={handleChange} required>
              <option value="">Indique tipo de usuario</option>
              <option value="coach">Coach</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="login-input-container" style={{marginTop: "50px"}}>
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default Register

