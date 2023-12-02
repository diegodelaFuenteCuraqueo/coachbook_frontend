import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { URL } from '../../constants'

const { LOCALHOST, API } = URL
const coachesApiUrl = LOCALHOST + API.coaches
const userTBapiURL = LOCALHOST + API.userTimeBlocks
const bookTBapiURL = LOCALHOST + API.bookTimeBlock
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
      <div>
        <h1>Pick Timeblock</h1>
        <h2>Choose a coach</h2>
        <select onChange={(e) => setCoachID(e.target.value)}>
          <option value="">Select a coach</option>
          {coaches.length > 0 &&
            coaches.map((coach) => (
              <option key={coach._id} value={coach._id}>
                {coach.username}
              </option>
            ))}
        </select>
      </div>
      <h2>Choose a timeblock</h2>
      <div>
        <h2>Your Timeblocks:</h2>
        <ul>
          { timeblocks?.length > 0 &&
            timeblocks.map((timeblock) => (
              <li key={timeblock._id}>
                <div style={{ border : "1px solid black"}}>
                  <div>
                    <p>Name: {timeblock.name}</p>
                    <p>Start Date: {timeblock.startDate}</p>
                    <p>End Date: {timeblock.endDate}</p>
                    { !timeblock?.available && timeblock.clientID?._id
                      ? <p>Not Available</p>
                      : <p>Available</p>
                    }
                  </div>
                  { timeblock?.available
                    ? <div>
                        <button onClick={() => { pickBlock(timeblock._id) }}>Select</button>
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
