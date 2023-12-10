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
    console.log('HomePage:useEffect user', isAuthenticated, user)
    fetchTimeblocks()
  }, [user])

  const fetchTimeblocks = async () => {
    if (user && isAuthenticated) {
      const tbs = await fetchUserTimeblocks(user._id)
      console.log('fetchTimeblocks', user, tbs)

      setTimeblocks(tbs)
    } else {
      console.log('fetchTimeblocks to login', user)
      navigate('/')
    }
  }

  const fetchUserTimeblocks = async (userID) => {
    try {
      const response = await axios.post(userTBapiURL, { userID, userTimeZone}) // Replace with your actual API endpoint
      const timeblocks = response.data.timeBlocks // Assuming the response is an array of timeblocks
      return timeblocks
    } catch (error) {
    }
  }

  const createTimeblock = async (formData) => {
    try {
      const response = await axios.post(createTBapiURL, {formData, user})
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

      const response = await axios.post(deleteTBapiURL, { timeblockID, user }) // Replace with your actual API endpoint
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

      const response = await axios.post(getEndpointURL("bookTimeBlock"), { timeblockID, _id: user._id }) // Replace with your actual API endpoint
      fetchTimeblocks()
    } catch (error) {
      console.error('Error booking timeblocks:', error)
    }
  }

  const cancelBooking = async (timeblockID) => {
    try {
      const selectedTimeblock = timeblocks.find( tb => tb._id === selectedEventID )
      if (!selectedTimeblock) return
      const confirm = window.confirm("¿Está seguro que desea anular la cita? (quedará como disponible) \n" + selectedTimeblock.name + "\n"+ DateFormater(selectedTimeblock.startDate))
      if (!confirm) return

      const response = await axios.post(getEndpointURL("cancelBooking"), { timeblockID, _id: user._id }) // Replace with your actual API endpoint
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
          ?<p> Acá puede ver las citas que ya ha solicitado. Puede ver el detalle de una cita solicitada al hacer click en el calendario. <br/>También solicitar una nueva cita haciendo click en <button className="btn btn-primary" onClick={() => navigate("/pick-timeblock")}>Agendar una cita</button></p>
          :<p> Para crear nuevas citas, haga click en el calendario. <br/>También puede ver el detalle de las citas creadas seleccionándolas en el calendario</p>
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
