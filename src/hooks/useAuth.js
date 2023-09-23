// src/hooks/useAuth.js
import { useState, useEffect } from 'react'

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // check the authentication token and update the state
  const checkToken = () => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }

  // Run checkToken when the component mounts and whenever the token changes
  useEffect(() => {
    checkToken()
  }, [])

  // Listen for changes to the authentication token and update the state
  useEffect(() => {
    window.addEventListener('storage', checkToken)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', checkToken)
    }
  }, [])

  return isAuthenticated
}
