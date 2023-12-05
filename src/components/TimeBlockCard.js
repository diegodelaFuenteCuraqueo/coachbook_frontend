import React from 'react'
import '../App.css'

function TimeBlockCard({timeblock, user, bookTimeBlock, cancelBooking, deleteTimeblock, editTimeBlock}) {
  console.log("TimeBlockCard", timeblock, user)
  return (
    <>
    <li key={timeblock?._id} className="home-timeblock-li">
    <div className="home-timeblock-li-element" style={{ border : "1px solid black"}}>
      <div>
        <p> Nombre: { timeblock?.name || "" }</p>
        <p> Fecha : { timeblock?.startDate || "" }</p>
        <p> Duración: { timeblock?.startDate ? "1 hora" : "" } </p>
        { user?.usertype !== "client"
          ? (
            !timeblock?.available //&& timeblock?.clientID?._id
            ? <p> Tomada por: { timeblock?.clientID?.username || "" }</p>
            : <p> Disponible </p>
          ) : (
            timeblock?.createdBy?.username
            ? <p>Coach: { timeblock?.createdBy?.username || "" } </p>
            : null
          )
        }
      </div>
      <div>
        { user?.usertype === "client" && !!timeblock && timeblock?.available
          ? <button className="btn btn-primary" onClick={() => {  bookTimeBlock(timeblock._id)  }}>Reservar</button>
          : user?.usertype === "client" && !!timeblock && !timeblock?.available
            ? <button className="btn btn-danger" onClick={() => {  cancelBooking(timeblock._id)  }}>Anular reserva</button>
            : null
        }
        { user?.usertype !== "client" && !!timeblock
          ? (
            <>
              <button className="btn btn-primary" onClick={() => {  editTimeBlock(timeblock._id)  }}>Editar</button>
              { !timeblock?.available ? <button className="btn btn-warning" onClick={() => {  cancelBooking(timeblock._id)  }}>Anular cita</button> : null }
              <button className="btn btn-danger" onClick={() => {  deleteTimeblock(timeblock._id)  }}>Borrar</button>
            </>
          ) : (
            null
          )
        }
      </div>
    </div>
  </li>
  </>

  )
}

export default TimeBlockCard
