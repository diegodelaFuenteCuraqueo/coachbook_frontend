// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  console.log('AuthProvider', isAuthenticated)
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    console.log('AuthProvider: useEffect', isAuthenticated, localStorage.getItem('token'))
  }, [])

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
