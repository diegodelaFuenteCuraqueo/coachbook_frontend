// src/components/Login.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import '../../App.css'
import { getEndpointURL } from '../../utils/getEndpointURL'

const apiUrl = getEndpointURL('changePassword')

function ChangePassword() {
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [logMessage, setLogMessage] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()


  const handleLogin = async () => {
    setLogMessage('')
    if ( password === newPassword ) {
      return setLogMessage('La nueva contraseña no puede ser igual a la anterior')
    }

    try {
      const response = await axios.post( apiUrl, { email: user.email, password, newPassword })
      navigate(`/logout`, { message: response.data } )
    } catch (error) {
      setLogMessage(error.response?.data?.message)
    }
  }

  return (
    <>
      <div className="container login-form-container">
        <h1 className="login-form-title">Cambiar contraseña</h1>
        <div className="login-input-container">
          <input
            required
            className="login-input-field"
            type="password"
            placeholder="Password anterior"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-input-container">
          <input
            required
            className="login-input-field"
            type="password"
            placeholder="Password nuevo"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="login-input-container">
          <p style={{ color: 'red' }}>{logMessage}</p>
          <button className="btn btn-primary" onClick={handleLogin}>Confirmar</button>
        </div>
      </div>
    </>
  )
}

export default ChangePassword
