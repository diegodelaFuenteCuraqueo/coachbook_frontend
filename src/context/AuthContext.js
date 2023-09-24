// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState(null)

  console.log('AuthProvider', isAuthenticated)
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setUserId(localStorage.getItem('userID'))
    console.log('AuthProvider: useEffect', isAuthenticated, localStorage.getItem('token'))
  }, [])

  const login = () => {
    setIsAuthenticated(true)
    setUserId(localStorage.getItem('userID'))
  }

  const logout = () => {
    localStorage.removeItem('userID')
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    userId
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
