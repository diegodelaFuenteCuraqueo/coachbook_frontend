// src/components/HomePage.js
import React from 'react'
import { useLocation } from 'react-router-dom'

const HomePage = () => {
  const location = useLocation()
  const username = new URLSearchParams(location.search).get('username')

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      {/* Add any other content you want to display on the homepage */}
    </div>
  )
}

export default HomePage
