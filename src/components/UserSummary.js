import React from 'react'
import '../App.css'

function UserSummary({ user }) {
  return (
    <div className="home-user-summary">
    <h1 className="home-welcome-title">Bienvenido, {user?.username || ""} !</h1>
    <ul>
      <li className="home-timeblock-li">Usertype: {user?.usertype || ""}</li>
      <li className="home-timeblock-li">Email: {user?.email || ""}</li>
      <li className="home-timeblock-li">Registrado el: {user?.registerDate || ""}</li>
      <li className="home-timeblock-li">ID: {user?._id || ""}</li>
    </ul>
  </div>  )
}

export default UserSummary
