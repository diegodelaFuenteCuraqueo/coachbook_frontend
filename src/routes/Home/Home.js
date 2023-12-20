// src/components/HomePage.js
import React, {useEffect, useState, useCallback} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.js'
import axios from 'axios'
import '../../App.css'
import UserSummary from '../../components/UserSummary.js'
import TimeBlockCard from '../../components/TimeBlockCard.js'
import Calendar from '../../components/Calendar.js'
import { DateFormater } from '../../utils/DateFormater.js'
import { getEndpointURL } from '../../utils/getEndpointURL'
import Popup from '../../components/Popup/Popup.jsx'
import AgendaSummary from '../../components/AgendaSummary'

const Home = () => {

  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [ timeblocks, setTimeblocks ] = useState([])
  const [ selectedEventID, setSelectedEventID ] = useState({})
  const [ showEditWindow, setShowEditWindow ] = useState(false)
  const [ serverMessage, setServerMessage ] = useState("")

  const userTBapiURL = getEndpointURL(user.usertype === "client" ? "clientTimeBlocks" : "userTimeBlocks")
  const deleteTBapiURL = getEndpointURL("deleteTimeBlock")
  const createTBapiURL = getEndpointURL("saveTimeBlock")
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const fetchUserTimeblocks = useCallback(async (userID) => {
    if (!isAuthenticated || !user) navigate('/')
    try {
      const response = await axios.post(userTBapiURL, { userID, userTimeZone})
      const timeblocks = response.data.timeBlocks
      return timeblocks
    } catch (error) {
    }
  }, [userTBapiURL, userTimeZone, user, isAuthenticated, navigate])

  const fetchTimeblocks = useCallback(async () => {
    if (!isAuthenticated || !user) navigate('/')
    try {
      const tbs = await fetchUserTimeblocks(user._id)
      setTimeblocks(tbs)
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
      setServerMessage(error.response.data.message)
    }
  }, [user, isAuthenticated, navigate, fetchUserTimeblocks])

  const createTimeblock = useCallback(async (formData) => {
    if (!isAuthenticated || !user) navigate('/')
    try {
      const response = await axios.post(createTBapiURL, {formData, user})
      fetchTimeblocks()
      setServerMessage(response.data.message)
    } catch (error) {
      console.error(error)
    }
  }, [createTBapiURL, user, fetchTimeblocks, navigate, isAuthenticated])

  useEffect(() => {
    fetchTimeblocks()
  }, [user, fetchTimeblocks])

  useEffect(() => {
    if (!showEditWindow && selectedEventID){
      fetchTimeblocks()
    }
  }, [showEditWindow, selectedEventID, fetchTimeblocks])

  const deleteTimeblock = useCallback(async (timeblockID) => {
    if (!isAuthenticated || !user) navigate('/')
    const selectedTimeblock = timeblocks.find( tb => tb._id === timeblockID )
    try {
      if (!selectedTimeblock) return
      const confirm = window.confirm("¿Está seguro que desea eliminar la cita? \n" + selectedTimeblock.name + "\n"+ DateFormater(selectedTimeblock.startDate))
      if (!confirm) return
      const response = await axios.post(deleteTBapiURL, { timeblockID, user })
      fetchTimeblocks()
      setServerMessage(response.data.message)
    } catch (error) {
      setServerMessage(error.response.data.message)
      console.error('Error fetching timeblocks:', error)
    }
  }, [timeblocks, deleteTBapiURL, user, fetchTimeblocks, navigate, isAuthenticated])

  const editTimeBlock = useCallback(async (timeblockID) => {
    setSelectedEventID(timeblockID)
    try {
      await setShowEditWindow(true)
      fetchTimeblocks()
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }, [setSelectedEventID, setShowEditWindow, fetchTimeblocks])

  const bookTimeBlock = useCallback(async (timeblockID) => {
    try {
      const selectedTimeblock = timeblocks.find( tb => tb._id === timeblockID )
      if (!selectedTimeblock) return
      const confirm = window.confirm("¿Está seguro que desea reservar la cita? \n" + selectedTimeblock.name + "\n"+ DateFormater(selectedTimeblock.startDate))
      if (!confirm) return
      const response = await axios.post(getEndpointURL("bookTimeBlock"), { timeblockID, _id: user._id })
      fetchTimeblocks()
      setServerMessage(response.data.message)
    } catch (error) {
      console.error('Error booking timeblocks:', error)
    }
  }, [timeblocks, user, fetchTimeblocks])

  const cancelBooking = useCallback(async (timeblockID) => {
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
  }, [timeblocks, user, fetchTimeblocks, selectedEventID])

  return (
    <>
      <Popup show={showEditWindow} setShow={setShowEditWindow} data={ JSON.stringify(timeblocks.find( tb => tb._id === selectedEventID)) } events={ timeblocks } deleteTimeblock={ deleteTimeblock }/>
      <UserSummary user={user} />

      <div className="container home-timeblock-container">
        <AgendaSummary timeblocks={ timeblocks } user={ user } navigate={ navigate }/>

        <TimeBlockCard
          timeblock={ timeblocks.find( tb => tb._id === selectedEventID  ) }
          user={ user }
          editTimeBlock={ editTimeBlock }
          //deleteTimeblock={ deleteTimeblock }
          bookTimeBlock={ bookTimeBlock }
          cancelBooking={ cancelBooking }
        />

        { serverMessage && <small>{ serverMessage }</small> }

        <Calendar
          timeblocks={ timeblocks }
          user={ user }
          setSelectedEventID={ setSelectedEventID }
          createTimeblock={ createTimeblock }
        />
      </div>
    </>
  )
}

export default Home
