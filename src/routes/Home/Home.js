// src/components/HomePage.js
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.js'
import axios from 'axios'
import '../../App.css'
import UserSummary from '../../components/UserSummary.js'
import TimeBlockCard from '../../components/TimeBlockCard.js'
import Calendar from '../../components/Calendar.js'
import { DateFormater } from '../../utils/DateFormater.js'
import { getEndpointURL } from '../../utils/getEndpointURL'

const Home = () => {

  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [ timeblocks, setTimeblocks] = useState([])
  const [ selectedEventID, setSelectedEventID] = useState({})

  const userTBapiURL = getEndpointURL(user.usertype === "client" ? "clientTimeBlocks" : "userTimeBlocks") //URL.LOCALHOST + URL.API.userTimeBlocks
  const deleteTBapiURL = getEndpointURL("deleteTimeBlock") //URL.LOCALHOST + URL.API.deleteTimeBlock
  const createTBapiURL = getEndpointURL("saveTimeBlock") //URL.LOCALHOST + URL.API.saveTimeBlock
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  useEffect(() => {
    fetchTimeblocks()
  }, [user])

  const fetchTimeblocks = async () => {
    if (user && isAuthenticated) {
      const tbs = await fetchUserTimeblocks(user._id)
      setTimeblocks(tbs)
    } else {
      navigate('/')
    }
  }

  const fetchUserTimeblocks = async (userID) => {
    try {
      const response = await axios.post(userTBapiURL, { userID, userTimeZone})
      const timeblocks = response.data.timeBlocks
      return timeblocks
    } catch (error) {
    }
  }

  const createTimeblock = async (formData) => {
    try {
      await axios.post(createTBapiURL, {formData, user})
      fetchTimeblocks()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteTimeblock = async (timeblockID) => {
    try {
      const selectedTimeblock = timeblocks.find( tb => tb._id === timeblockID )
      if (!selectedTimeblock) return
      const confirm = window.confirm("¿Está seguro que desea eliminar la cita? \n" + selectedTimeblock.name + "\n"+ DateFormater(selectedTimeblock.startDate))
      if (!confirm) return
      await axios.post(deleteTBapiURL, { timeblockID, user })
      fetchTimeblocks()
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  const editTimeBlock = async (timeblockID) => {
    navigate(`/edit-timeblock`, { state: { timeblockID } })
  }

  const bookTimeBlock = async (timeblockID) => {
    try {
      const selectedTimeblock = timeblocks.find( tb => tb._id === timeblockID )
      if (!selectedTimeblock) return
      const confirm = window.confirm("¿Está seguro que desea reservar la cita? \n" + selectedTimeblock.name + "\n"+ DateFormater(selectedTimeblock.startDate))
      if (!confirm) return
      await axios.post(getEndpointURL("bookTimeBlock"), { timeblockID, _id: user._id })
      fetchTimeblocks()
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
      fetchTimeblocks()
    } catch (error) {
      console.error('Error canceling timeblocks:', error)
    }
  }

  return (
    <>
      <UserSummary user={user} />

      <div className="container home-timeblock-container">
        <h2 className="login-form-title">Agenda</h2>
        <p> Usted tiene {timeblocks?.length || 0 } citas { user.usertype === "client" ? "solicitadas" : "creadas" }</p>
        { user.usertype === "client"
          ?<p> Acá puede ver sus sesiones ya agendadas. Puede ver el detalle de una cita al hacer click en evento del calendario. <br/>También solicitar una nueva cita haciendo click en <button className="btn btn-primary" onClick={() => navigate("/pick-timeblock")}>Agendar una cita</button></p>
          :<p> Para crear nuevas citas, haga click en el dia y hora en el calendario. <br/>También puede ver el detalle de cada cita haciendo click en el evento del calendario. </p>
        }
        <TimeBlockCard
          timeblock={ timeblocks.find( tb => tb._id === selectedEventID  ) }
          user={user}
          editTimeBlock={editTimeBlock}
          deleteTimeblock={deleteTimeblock}
          bookTimeBlock={bookTimeBlock}
          cancelBooking={cancelBooking}
        />
        <Calendar
          timeblocks={timeblocks}
          user={user}
          setSelectedEventID={setSelectedEventID}
          createTimeblock={createTimeblock}
        />
      </div>
    </>
  )
}

export default Home
