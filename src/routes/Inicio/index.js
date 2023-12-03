import React from 'react'
import NavBar from "../../components/NavBar"
import '../../App.css'

function LoginPage() {
  return (
    <>
      <NavBar />
      <div className="home-user-summary">
        <h1 className="home-welcome-title">CoachBook</h1>
        <br></br>
        <p> Sistema de gestión de citas para sesiones de coaching</p>
      </div>
    </>
  );
}

export default LoginPage