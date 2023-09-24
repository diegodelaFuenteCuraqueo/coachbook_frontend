// src/components/HomePage.js
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
const apiUrl = 'http://localhost:5000'

const HomePage = () => {

  const navigate = useNavigate()
  const { isAuthenticated, logout, userId } = useAuth()
  const [ timeblocks, setTimeblocks] = useState([])

  // Inside your component function
  const fetchUserTimeblocks = async (userID) => {
    try {
      console.log('fetchUserTimeblocks', userID)
      const response = await axios.post(apiUrl+'/api/user-timeblocks', { userID }) // Replace with your actual API endpoint
      const timeblocks = response.data.timeBlocks // Assuming the response is an array of timeblocks
      console.log(timeblocks)
      // Set the timeblocks in your component's state or context if necessary
      return timeblocks
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  useEffect(() => {
    console.log('HomePage', isAuthenticated, userId)
    const fetchTimeblocks = async () => {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        setTimeblocks(await fetchUserTimeblocks(userId))
      }
    }
    fetchTimeblocks()
  }, [])

  return (
    <>
      <div>
        <h1>Welcome!</h1>
        <button onClick={() => { navigate('/register') }}>Register</button>
        <button onClick={() => { navigate('/create-timeblock') }}>Create timeblock</button>
        <button onClick={() => { logout(); navigate('/login') }}>Log out</button>
      </div>
      <div>
        <h2>Your Timeblocks:</h2>
        <ul>
          { timeblocks.map((timeblock) => (
              <li key={timeblock._id}>
                <div style={{ border : "1px solid black"}}>
                  <p>Name: {timeblock.name}</p>
                  <p>Start Date: {timeblock.startDate}</p>
                  <p>End Date: {timeblock.endDate}</p>
                </div>
              </li>
          ))}
        </ul>
      </div>
    </>
  )
}


export default HomePage
