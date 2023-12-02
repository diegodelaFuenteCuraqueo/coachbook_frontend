// src/components/HomePage.js
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.js'
import axios from 'axios'
import { URL } from '../../constants.js'
import '../../App.css'

const userTBapiURL = URL.LOCALHOST + URL.API.userTimeBlocks
const deleteTBapiURL = URL.LOCALHOST + URL.API.deleteTimeBlock
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

const Home = () => {

  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
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
      const response = await axios.post(userTBapiURL, { userID, userTimeZone}) // Replace with your actual API endpoint
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
      <div className="home-user-summary">
        <h1 className="home-welcome-title">Welcome, {user?.username || ""} !</h1>
        <ul>
          <li className="home-timeblock-li">Usertype: {user?.usertype || ""}</li>
          <li className="home-timeblock-li">email: {user?.email || ""}</li>
          <li className="home-timeblock-li">registered on: {user?.registerDate || ""}</li>
          <li className="home-timeblock-li">id: {user?._id || ""}</li>
        </ul>
      </div>
      <div className="container home-timeblock-container">
        <h2 className="login-form-title">Your Timeblocks:</h2>
        <ul className="home-timeblock-ul">
          { timeblocks && timeblocks.map((timeblock) => (
              <li key={timeblock._id} className="home-timeblock-li">
                <div className="home-timeblock-li-element" style={{ border : "1px solid black"}}>
                  <div>
                    <p>Name: {timeblock.name}</p>
                    <p>Start Date: { timeblock.startDate}</p>
                    <p>End Date: { timeblock.endDate}</p>
                    { !timeblock?.available && timeblock.clientID?._id
                      ? <p>Client: {timeblock.clientID?.username}</p>
                      : <p>Available</p>
                    }
                  </div>
                  <div>
                    <button className="btn btn-primary" onClick={() => { editTimeBlock(timeblock._id) }}>Edit</button>
                    <button className="btn btn-danger" onClick={() => { deleteTimeblock(timeblock._id) }}>Delete</button>
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

export default Home
