// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { getEndpointURL } from '../utils/getEndpointURL'

const apiUrl = getEndpointURL('user')

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState({})
  const [token, setToken] = useState(null)

  useEffect(() => {
    const ls_token = localStorage.getItem('token')
    const ls_user = localStorage.getItem('userID')
    try {
      fetchUserData(ls_user)
      setToken(ls_token)
    } catch (error) {
      console.error('Error parsing user string:', error)
    }
  }, [])

  useEffect(() => {
    setIsAuthenticated(!!token && !!user)
  }, [user, token])

  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userID', data.userPayload.id)
    fetchUserData(data.userPayload.id)
    setToken(data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('userID')
    localStorage.removeItem('token')
  }

  const fetchUserData = async (id) => {
    try {
      const response = await axios.post(apiUrl, { id }) // Replace with your actual API endpoint

      const u = response.data.user
      setUser(u)
      return u
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
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
