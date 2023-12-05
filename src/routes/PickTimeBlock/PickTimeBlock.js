import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import '../../App.css'
import { getEndpointURL } from '../../utils/getEndpointURL'
import TimeBlockCard from '../../components/TimeBlockCard.js'
import Calendar from '../../components/Calendar.js'

const coachesApiUrl = getEndpointURL("coaches") // LOCALHOST + API.coaches
const userTBapiURL = getEndpointURL("userTimeBlocks") // LOCALHOST + API.userTimeBlocks
const bookTBapiURL = getEndpointURL("bookTimeBlock") // LOCALHOST + API.bookTimeBlock
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
        console.log('PickTimeBlock', isAuthenticated, user)
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
      console.log('fetchCoachList')
      const response = await axios.get(coachesApiUrl)
      const coachesData = response.data.coaches
      console.log('coaches', coachesData)
      return coachesData
    } catch (error) {
      console.error('Error fetching coaches:', error)
      throw error // Propagate the error to handle it in useEffect
    }
  }

  useEffect(() => {
    console.log("about to execute fetchCoachTimeblocks", coachID)
    if (coachID) {
      fetchCoachTimeblocks(coachID)
    } else {
      setTimeblocks([])
    }
  }, [coachID])

  const fetchCoachTimeblocks = async (id = coachID) => {
    if (user && isAuthenticated) {
      console.log('fetchCoachTimeblocks', id)
      const coachTimeblocks = await fetchUserTimeblocks(id)
      setTimeblocks(coachTimeblocks.filter( tb => tb.available))
    } else {
      console.log('fetchCoachTimeblocks to login', user)
      navigate('/')
    }
  }

  const fetchUserTimeblocks = async (userID) => {
    try {
      console.log('fetchCoachTimeblocks', userID)
      const response = await axios.post(userTBapiURL, { userID, userTimeZone }) // Replace with your actual API endpoint
      const timeblocks = response.data.timeBlocks // Assuming the response is an array of timeblocks
      console.log(timeblocks)
      return timeblocks
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  const bookTimeBlock = async (timeblockID) => {
    console.log('bookTimeBlock', timeblockID)
    try {
      const selectedTimeblock = timeblocks.find( tb => tb._id === timeblockID )
      if (!selectedTimeblock) return
      const confirm = window.confirm("¿Está seguro que desea reservar la cita? \n" + selectedTimeblock.name + "\n"+ selectedTimeblock.startDate)
      if (!confirm) return

      const response = await axios.post(getEndpointURL("bookTimeBlock"), { timeblockID, clientID: user._id }) // Replace with your actual API endpoint
      console.log(" BOOKING RESPONSE: ", response)
      fetchCoachTimeblocks()
    } catch (error) {
      console.error('Error booking timeblocks:', error)
    }
  }

  const cancelBooking = async (timeblockID) => {
    console.log('cancelBooking', timeblockID)
    try {
      const selectedTimeblock = timeblocks.find( tb => tb._id === selectedEventID )
      console.log("selectedTimeblock", selectedTimeblock)
      if (!selectedTimeblock) return
      const confirm = window.confirm("¿Está seguro que desea anular la cita? \n" + selectedTimeblock.name + "\n"+ selectedTimeblock.startDate)
      if (!confirm) return

      const response = await axios.post(getEndpointURL("cancelBooking"), { timeblockID, _id: user._id }) // Replace with your actual API endpoint
      console.log(" CANCEL BOOKING RESPONSE: ", response)
      fetchCoachTimeblocks()
    } catch (error) {
      console.error('Error canceling timeblocks:', error)
    }
  }


  const pickTimeblock = async (timeblockID) => {
    try {
      console.log('pickBlock', timeblocks)
      const response = await axios.post(bookTBapiURL, { timeblockID, clientID: user._id }) // Replace with your actual API endpoint
      console.log({ timeblockID: timeblocks[0]._id, clientID: user._id }, response)
      fetchCoachTimeblocks(coachID)
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  return (
    <>
      <div className="container pick-timeblock-container">
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
      <div className="container home-timeblock-container">
        <h2 className="login-form-title">Seleccione una cita:</h2>
        <TimeBlockCard
          timeblock={ timeblocks.find( tb => tb._id === selectedEventID  ) }
          user={user}
          bookTimeBlock={bookTimeBlock}
          cancelBooking={cancelBooking}
        />
        <Calendar user={user} timeblocks={timeblocks}  setSelectedEventID={setSelectedEventID} />
      </div>

    </>
  )

}

export default PickTimeBlock
