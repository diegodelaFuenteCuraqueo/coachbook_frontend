// src/components/HomePage.js
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.js'
import axios from 'axios'
import '../../App.css'
import { getEndpointURL } from '../../utils/getEndpointURL'


const Home = () => {

  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [ timeblocks, setTimeblocks] = useState([])

  const userTBapiURL = getEndpointURL(user.usertype === "client" ? "clientTimeBlocks" : "userTimeBlocks") //URL.LOCALHOST + URL.API.userTimeBlocks
  const deleteTBapiURL = getEndpointURL("deleteTimeBlock") //URL.LOCALHOST + URL.API.deleteTimeBlock
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  useEffect(() => {
    console.log('HomePage', isAuthenticated, user)
    //fetchTimeblocks()
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
        <h1 className="home-welcome-title">Bienvenido, {user?.username || ""} !</h1>
        <ul>
          <li className="home-timeblock-li">Usertype: {user?.usertype || ""}</li>
          <li className="home-timeblock-li">Email: {user?.email || ""}</li>
          <li className="home-timeblock-li">Registrado el: {user?.registerDate || ""}</li>
          <li className="home-timeblock-li">ID: {user?._id || ""}</li>
        </ul>
      </div>
      <div className="container home-timeblock-container">
        <h2 className="login-form-title">Sus citas:</h2>
        <ul className="home-timeblock-ul">
          { timeblocks && timeblocks.map((timeblock) => (
              <li key={timeblock._id} className="home-timeblock-li">
                <div className="home-timeblock-li-element" style={{ border : "1px solid black"}}>
                  <div>
                    <p> Nombre: {timeblock.name}</p>
                    <p> Fecha de inicio: { timeblock.startDate }</p>
                    <p> Fecha de fin: { timeblock.endDate }</p>
                    { user?.usertype !== "client"
                      ? (
                        !timeblock?.available && timeblock.clientID?._id
                        ? <p> Tomada por: { timeblock.clientID?.username }</p>
                        : <p> Disponible </p>
                      ) : (
                        timeblock.createdBy?.username
                        ? <p>Coach: { timeblock.createdBy?.username } </p>
                        : null
                      )
                    }
                  </div>
                  <div>
                    <button className="btn btn-primary" onClick={() => { editTimeBlock(timeblock._id) }}>Editar</button>
                    <button className="btn btn-danger" onClick={() => { deleteTimeblock(timeblock._id) }}>Borrar</button>
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
