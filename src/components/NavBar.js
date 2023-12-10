import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()

  const handleLinkClick = (event) => {
    event.preventDefault()
    const href = event.currentTarget.getAttribute('href')
    setMenuVisible(false)

    if (href === '/logout') {
      logout()
      navigate('/')
    } else {
      navigate(href)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" onClick={handleLinkClick} href="/inicio">CoachBook</a>
        <button className="navbar-toggler" onClick={ () => setMenuVisible(!menuVisible) } type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${!menuVisible ? "collapse" : ""} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
              { (isAuthenticated && user && (user.usertype !== 'client'))
                ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/home">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/register">Registar usuario</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/change-password">Cambiar contraseña</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/logout">Cerrar sesión</a>
                  </li>
                </>
                ) : (isAuthenticated && user && user.usertype === 'client')
                  ? (
                    <>
                      <li className="nav-item">
                        <a className="nav-link" onClick={handleLinkClick} href="/home">Home</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" onClick={handleLinkClick} href="/pick-timeblock">Agendar una cita</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" onClick={handleLinkClick} href="/change-password">Cambiar contraseña</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" onClick={handleLinkClick} href="/logout">Cerrar sesión</a>
                      </li>
                    </>
                  ) : (
                  <>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLinkClick} href="/login">Iniciar Sesión</a>
                  </li>
                  </>
                )
              }
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
