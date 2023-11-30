// src/components/HomePage.js
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
const apiUrl = 'http://localhost:5000'

const HomePage = () => {

  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  const [ timeblocks, setTimeblocks] = useState([])

  // Inside your component function
  const fetchUserTimeblocks = async (userID) => {
    try {
      console.log('fetchUserTimeblocks', user)
      const response = await axios.post(apiUrl+'/api/user-timeblocks', { userID }) // Replace with your actual API endpoint
      const timeblocks = response.data.timeBlocks // Assuming the response is an array of timeblocks
      console.log(timeblocks)
      // Set the timeblocks in your component's state or context if necessary
      return timeblocks
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  const deleteTimeblock = async (timeblockID) => {
    try {
      console.log('deleteTimeblock', timeblockID)
      const response = await axios.post(apiUrl+'/api/delete-timeblock', { timeblockID, _id: user.id }) // Replace with your actual API endpoint
      console.log(response)
      setTimeblocks(await fetchUserTimeblocks(user.id))
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  const editTimeBlock = async (timeblockID) => {
    console.log('editTimeBlock', timeblockID)
    navigate(`/edit-timeblock`, { state: { timeblockID } })
  }

  useEffect(() => {
    console.log('HomePage', isAuthenticated, user)
    const fetchTimeblocks = async () => {
      if (!isAuthenticated || !user) {
        navigate('/login');
      } else {
        setTimeblocks(await fetchUserTimeblocks(user.id))
      }
    }
    fetchTimeblocks()
  }, [])

  return (
    <>
      <div>
        <h1>Welcome, {user?.username || ""} !</h1>
        <ul>
          <li>Usertype: {user?.usertype || ""}</li>
          <li>email: {user?.email || ""}</li>
          <li>registered on: {user?.registerDate || ""}</li>
          <li>id: {user?.id || ""}</li>
        </ul>
        <button onClick={() => { navigate('/create-timeblock') }}>Create timeblock</button>
        <button onClick={() => { logout(); navigate('/login') }}>Log out</button>
      </div>
      <div>
        <h2>Your Timeblocks:</h2>
        <ul>
          { timeblocks.map((timeblock) => (
              <li key={timeblock._id}>
                <div style={{ border : "1px solid black"}}>
                  <div>
                    <p>Name: {timeblock.name}</p>
                    <p>Start Date: {timeblock.startDate}</p>
                    <p>End Date: {timeblock.endDate}</p>
                  </div>
                  <div>
                    <button onClick={() => { editTimeBlock(timeblock._id) }}>Edit</button>
                    <button onClick={() => { deleteTimeblock(timeblock._id) }}>Delete</button>
                    </div>
                </div>
              </li>
          ))}
        </ul>
      </div>

      <br/>
    </>
  )
}

export default HomePage
