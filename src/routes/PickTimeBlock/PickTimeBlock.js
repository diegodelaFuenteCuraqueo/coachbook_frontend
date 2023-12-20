import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import '../../App.css'
import './styles.css'
import { getEndpointURL } from '../../utils/getEndpointURL'
import { DateFormater } from '../../utils/DateFormater'
import TimeBlockCard from '../../components/TimeBlockCard.js'
import Calendar from '../../components/Calendar.js'

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

function PickTimeBlock() {
  const { isAuthenticated, user } = useAuth()
  const [coaches, setCoaches] = useState([])
  const [coachID, setCoachID] = useState('')
  const [timeblocks, setTimeblocks] = useState([])
  const [selectedEventID, setSelectedEventID] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coachesData = await fetchCoachList()
        setCoaches(coachesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [isAuthenticated, user])

  const fetchCoachList = async () => {
    try {
      const response = await axios.get(getEndpointURL("coaches"))
      const coachesData = response.data.coaches
      return coachesData
    } catch (error) {
      console.error('Error fetching coaches:', error)
      throw error
    }
  }

  const fetchCoachTimeblocks = useCallback(async (id = coachID) => {
    if (user && isAuthenticated) {
      const coachTimeblocks = await fetchUserTimeblocks(id)
      setTimeblocks(coachTimeblocks.filter( tb => tb.available))
    } else {
      navigate('/')
    }
  }, [coachID, user, isAuthenticated, navigate])

  useEffect(() => {
    if (coachID) {
      fetchCoachTimeblocks(coachID)
    } else {
      setTimeblocks([])
    }
  }, [coachID, fetchCoachTimeblocks])

  const fetchUserTimeblocks = async (userID) => {
    try {
      const response = await axios.post(getEndpointURL("userTimeBlocks"), { userID, userTimeZone })
      const timeblocks = response.data.timeBlocks
      return timeblocks
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  const bookTimeBlock = async (timeblockID) => {
    try {
      const selectedTimeblock = timeblocks.find( tb => tb._id === timeblockID )
      if (!selectedTimeblock) return
      const confirm = window.confirm("¿Está seguro que desea reservar la cita? \n" + selectedTimeblock.name + "\n"+ DateFormater(selectedTimeblock.startDate))
      if (!confirm) return
      await axios.post(getEndpointURL("bookTimeBlock"), { timeblockID, clientID: user._id })
      fetchCoachTimeblocks()
    } catch (error) {
      console.error('Error booking timeblocks:', error)
    }
  }

  const cancelBooking = async (timeblockID) => {
    try {
      const selectedTimeblock = timeblocks.find( tb => tb._id === selectedEventID )
      if (!selectedTimeblock) return
      const confirm = window.confirm("¿Está seguro que desea anular la cita? (quedará disponible para otro coachee) \n" + selectedTimeblock.name + "\n"+ DateFormater(selectedTimeblock.startDate))
      if (!confirm) return

      await axios.post(getEndpointURL("cancelBooking"), { timeblockID, _id: user._id })
      fetchCoachTimeblocks()
    } catch (error) {
      console.error('Error canceling timeblocks:', error)
    }
  }

  return (
    <>
      <div className="container pick-timeblock-head-container">
        <h1 className="home-welcome-title">Agendar cita</h1>
        <p> Para solicitar una cita, primero debe seleccionar un coach de la lista. El calendario desplegará los horarios disponibles del coach indicado.
        <br/> Para reservar una cita, seleccione un horario disponible y presione el botón "Reservar".
        </p>
        <label >Seleccione un coach</label>
        <select className="login-input-field" onChange={(e) => setCoachID(e.target.value)}>
          <option value="">Select a coach</option>
          {coaches.length > 0 &&
            coaches.map((coach) => (
              <option key={coach._id} value={coach._id}>
                {coach.username}
              </option>
            ))}
        </select>
      </div>
      <div className="container pick-timeblock-container fixed">
        <h2 className="login-form-title">Seleccione una cita:</h2>
        <TimeBlockCard
          timeblock={ timeblocks.find(tb => tb._id === selectedEventID) }
          user={ user }
          bookTimeBlock={ bookTimeBlock }
          cancelBooking={ cancelBooking }
        />
        <Calendar user={ user } timeblocks={ timeblocks }  setSelectedEventID={ setSelectedEventID } />
      </div>

    </>
  )

}

export default PickTimeBlock
