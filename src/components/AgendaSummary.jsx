

function AgendaSummary({ timeblocks, user, navigate }) {
  return (
    <>
      <h2 className="login-form-title">Agenda</h2>
      <p> Usted tiene {timeblocks?.length || 0 } citas { user.usertype === "client" ? "solicitadas" : "creadas" }</p>
      { user.usertype === "client"
        ?<p> Acá puede ver sus sesiones ya agendadas. Puede ver el detalle de una cita al hacer click en evento del calendario. <br/>También solicitar una nueva cita haciendo click en <button className="btn btn-primary" onClick={() => navigate("/pick-timeblock")}>Agendar una cita</button></p>
        :<p> Para crear nuevas citas, haga click en el dia y hora en el calendario. <br/>También puede ver el detalle de cada cita haciendo click en el evento del calendario. </p>
      }
    </>
  )
}

export default AgendaSummary