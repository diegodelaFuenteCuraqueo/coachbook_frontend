import React, { useState, useEffect } from "react"
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import GetDeviceType from "../utils/GetDeviceType.js"
import moment from "moment"
import 'moment/locale/es'; // Import Spanish locale

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  showMore: total => `+ Ver más (${total})`
};

const localizer = momentLocalizer(moment)

const Calendar = ({ timeblocks, user, setSelectedEventID, createTimeblock }) => {
  const [events, setEvents] = useState([])
  const { isMobile } = GetDeviceType()

  useEffect(() => {
    const events = timeblocks.map((tb) => {
      return {
        title: tb.name,
        start: new Date(tb.startDate),
        end: new Date(tb.endDate),
        id: tb._id,
        available: tb.available,
      }
    })
    setEvents(events)
  }, [timeblocks])

  const handleEventClick = (event) => {
    setSelectedEventID(event.id )
  }

  const handleSelectSlot = ({ start, end }) => {
    console.log("handleSelectSlot")
    if (user.usertype === "client") return // el cliente solo clieckea eventos ya creados
    const minimumDuration = 60 * 60 * 1000

    const timeDiff = end.getTime() - start.getTime()
    if (timeDiff < minimumDuration) {
      end = new Date(start.getTime() + minimumDuration)
    }

    const isOverlapping = events.some((event) => {
      return (
        (start >= event.start && start < event.end) ||
        (end > event.start && end <= event.end) ||
        (start <= event.start && end >= event.end)
      )
    })

    if (isOverlapping) {
      alert("El bloque seleccionado coincide con otro evento. \nPor favor, seleccione otro bloque (1 hora mínimo)")
      return
    }

    const title = window.prompt("Nombre de la cita (requerido) ")
    if (!title) return

    createTimeblock({
      name: title || "Sin nombre",
      startDate: start,
      endDate: end,
      createdBy: user._id,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  }

  const getEventStyle = (event) => {
    const backgroundColor = event.available ? '#4caf50' : '#E1C16E'
    let style = {
      backgroundColor,
    }
    return {
      style: style
    }
  }


  return (
    <>
      <div style={{ height: "500px", backgroundColor: "lightGray", borderColor: "black" }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          defaultView={ isMobile ? "month" : "week" }
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          views={["week", "day", "agenda", "month"]}
          step={15}
          timeslots={2}
          defaultDate={new Date()}
          messages={messages}
          eventPropGetter={getEventStyle} 
        />
      </div>
    </>
  )
}

export default Calendar
