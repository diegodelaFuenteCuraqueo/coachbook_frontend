import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import '../../App.css'
import { getEndpointURL } from '../../utils/getEndpointURL'

const coachesApiUrl = getEndpointURL("coaches") // LOCALHOST + API.coaches
const userTBapiURL = getEndpointURL("userTimeBlocks") // LOCALHOST + API.userTimeBlocks
const bookTBapiURL = getEndpointURL("bookTimeBlock") // LOCALHOST + API.bookTimeBlock
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

function PickTimeBlock() {
  const { isAuthenticated, user } = useAuth()
  const [coaches, setCoaches] = useState([])
  const [coachID, setCoachID] = useState('')
  const [timeblocks, setTimeblocks] = useState([])
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

  const fetchCoachTimeblocks = async (id) => {
    if (user && isAuthenticated) {
      console.log('fetchCoachTimeblocks', id)
      setTimeblocks(await fetchUserTimeblocks(id))
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

  const pickBlock = async (timeblockID) => {
    try {
      console.log('pickBlock', timeblocks)
      const response = await axios.post(bookTBapiURL, { timeblockID, clientID: user._id }) // Replace with your actual API endpoint
      console.log({ timeblockID: timeblocks[0]._id, clientID: user._id }, response)
      fetchCoachTimeblocks(coachID)
      //navigate(`/home`)
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  return (
    <>
      <div className="container pick-timeblock-container">
        <h1 className="home-welcome-title">Agendar cita</h1>
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
        <ul className="home-timeblock-ul">
          { timeblocks?.length > 0 &&
            timeblocks.map((timeblock) => (
              <li key={timeblock._id} className="home-timeblock-li">
                <div className="home-timeblock-li-element">
                  <div>
                    <p>Nombre: {timeblock.name}</p>
                    <p>Fecha de inicio: {timeblock.startDate}</p>
                    <p>Fecha de fin: {timeblock.endDate}</p>
                    { !timeblock?.available && timeblock.clientID?._id
                      ? <p>No disponible</p>
                      : <p>Disponible</p>
                    }
                  </div>
                  { timeblock?.available
                    ? <div>
                        <button className="btn btn-primary" onClick={() => { pickBlock(timeblock._id) }}>Agendar</button>
                      </div>
                    : null
                  }
                </div>
              </li>
          ))}
        </ul>
      </div>

    </>
  )

}

export default PickTimeBlock
