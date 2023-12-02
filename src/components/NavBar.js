import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()

  const handleLinkClick = (event) => {
    event.preventDefault() // Prevents the default behavior of the link
    const href = event.currentTarget.getAttribute('href') // Get the href attribute
    setMenuVisible(false)

    if (href === '/logout') {
      logout()
      navigate('/')
    } else {
      navigate(href) // Navigate to the specified route
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" onClick={handleLinkClick} href="/home">CoachBook</a>
        <button className="navbar-toggler" onClick={ () => setMenuVisible(!menuVisible) } type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${!menuVisible ? "collapse" : ""} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" onClick={handleLinkClick} href="/inicio">Inicio</a>
              </li>

              { (isAuthenticated && user)
                ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/home">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/pick-timeblock">Pick timeblock</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/create-timeblock">Create timeblock</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/register">Register new user</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/logout">Log out</a>
                  </li>
                </>
                ) : (
                  <>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/login">Log in</a>
                  </li>
                  </>
                )
              }
              <li className="nav-item">
                <a className="nav-link" onClick={handleLinkClick} href="/about">Acerca de...</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={handleLinkClick} href="/contact">Contacto</a>
              </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
