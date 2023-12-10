import React, { useEffect, useState } from 'react'
import { DateFormater } from '../utils/DateFormater.js'
import '../App.css'

function UserSummary({ user }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let prevScrollPos = window.scrollY
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const isVisible = /*prevScrollPos > currentScrollPos || */ currentScrollPos < 50
      setIsVisible(isVisible)
      prevScrollPos = currentScrollPos
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={`home-user-summary ${isVisible ? 'visible' : 'hidden'}`}>
    <h1 className="home-welcome-title">Bienvenido, {user?.username || ""} !</h1>
    <ul>
      <li className="home-timeblock-li">Usertype: {user?.usertype || ""}</li>
      <li className="home-timeblock-li">Email: {user?.email || ""}</li>
      <li className="home-timeblock-li">Registrado el: {DateFormater(user?.registerDate)|| ""}</li>
    </ul>
  </div>  )
}

export default UserSummary
