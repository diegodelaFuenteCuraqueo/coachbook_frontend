// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  console.log('AuthProvider', isAuthenticated)
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setUser(localStorage.getItem('user'))
    console.log('AuthProvider: useEffect', isAuthenticated, localStorage.getItem('token'))
  }, [])

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    user,
    setUser,
    token,
    setToken
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
