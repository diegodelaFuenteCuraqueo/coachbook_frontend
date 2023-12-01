import React, { useEffect, useState  } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext' // Import the useAuth hook
import { URL } from '../constants.js'

const editTBApiUrl = URL.LOCALHOST + URL.API.editTimeBlock
const getTBApiUrl = URL.LOCALHOST + URL.API.timeBlock

const EditTimeBlock = () => {
  const location = useLocation()
  const receivedData = location.state
  const navigate = useNavigate()
  const { user } = useAuth()

  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    createdBy: "", //user.id || "650f416197c0c31963b71f2a", // This should be the user's ID
    clientID: ''
  })

  useEffect(() => {
    console.log("receivedData", receivedData)
    try {
      const fetchTimeblock = async () => {
        //const response = await axios.post(apiUrl+'/api/timeblock', { timeblockID: receivedData.timeblockID, userID: user._id })
        const response = await axios.post(getTBApiUrl, { timeblockID: receivedData.timeblockID, userID: user._id })

        console.log(response.data)
        const { name, clientID="" } = response.data.timeBlock
        const startDate = response.data.timeBlock.startDate.slice(0, 16)
        const endDate = response.data.timeBlock.endDate.slice(0, 16)
        setFormData({ name, startDate, endDate, createdBy: user.id, clientID: response.data.timeBlock?.clientID || "" })
      }
      fetchTimeblock()
    } catch (error) {
      console.error(error)
    }
  }, [])

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      console.log('handleSubmit', formData)
      // Make a POST request to create a new time block
      const response = await axios.post(editTBApiUrl, {timeblockID: receivedData.timeblockID, ...formData})
      console.log("response", response)
      // Redirect to a page showing the newly created time block
      navigate(`/home`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>EditTimeBlock Time Block</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date</label>
          <input
            type="datetime-local"
            name="startDate"
            id="startDate"
            onChange={handleChange}
            value={formData.startDate}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date</label>
          <input
            type="datetime-local"
            name="endDate"
            id="endDate"
            onChange={handleChange}
            value={formData.endDate}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">ClientID</label>
          <input
            type="text"
            name="clientID"
            id="clientID"
            onChange={handleChange}
            value={formData.clientID}
          />
        </div>
        <button type="submit">Update timeblock</button>
      </form>
    </div>
  )
}

export default EditTimeBlock
