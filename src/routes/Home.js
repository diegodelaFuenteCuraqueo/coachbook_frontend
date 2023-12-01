// src/components/HomePage.js
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { URL } from '../constants.js'

const userTBapiURL = URL.LOCALHOST + URL.API.userTimeBlocks
const deleteTBapiURL = URL.LOCALHOST + URL.API.deleteTimeBlock

const HomePage = () => {

  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  const [ timeblocks, setTimeblocks] = useState([])

  useEffect(() => {
    console.log('HomePage', isAuthenticated, user)
    fetchTimeblocks()
  }, [])

  useEffect(() => {
    console.log('HomePage:useEffect user', isAuthenticated, user)
    fetchTimeblocks()
  }, [user])

  const fetchTimeblocks = async () => {
    if (user && isAuthenticated) {
      console.log('fetchTimeblocks', user)
      setTimeblocks(await fetchUserTimeblocks(user._id))
    } else {
      console.log('fetchTimeblocks to login', user)
      navigate('/')
    }
  }

  const fetchUserTimeblocks = async (userID) => {
    try {
      console.log('fetchUserTimeblocks', userID)
      const response = await axios.post(userTBapiURL, { userID }) // Replace with your actual API endpoint
      const timeblocks = response.data.timeBlocks // Assuming the response is an array of timeblocks
      console.log(timeblocks)
      return timeblocks
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  const deleteTimeblock = async (timeblockID) => {
    try {
      console.log('deleteTimeblock', timeblockID)
      const response = await axios.post(deleteTBapiURL, { timeblockID, _id: user._id }) // Replace with your actual API endpoint
      console.log(response)
      fetchTimeblocks()
    } catch (error) {
      console.error('Error fetching timeblocks:', error)
    }
  }

  const editTimeBlock = async (timeblockID) => {
    console.log('editTimeBlock', timeblockID)
    navigate(`/edit-timeblock`, { state: { timeblockID } })
  }

  return (
    <>
      <div>
        <h1>Welcome, {user?.username || ""} !</h1>
        <ul>
          <li>Usertype: {user?.usertype || ""}</li>
          <li>email: {user?.email || ""}</li>
          <li>registered on: {user?.registerDate || ""}</li>
          <li>id: {user?._id || ""}</li>
        </ul>
        <button onClick={() => { navigate('/create-timeblock') }}>Create timeblock</button>
        <button onClick={() => { navigate('/pick-timeblock') }}>Pick timeblock</button>
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
                    { !timeblock?.available && timeblock.clientID?._id
                      ? <p>Client: {timeblock.clientID?.username}</p>
                      : <p>Available</p>
                    }
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
