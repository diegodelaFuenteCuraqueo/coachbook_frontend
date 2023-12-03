import React, { useEffect, useState  } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext.js' // Import the useAuth hook
import '../../App.css'
import { getEndpointURL } from '../../utils/getEndpointURL'

const editTBApiUrl = getEndpointURL("editTimeBlock")// URL.LOCALHOST + URL.API.editTimeBlock
const getTBApiUrl = getEndpointURL("timeBlock")// URL.LOCALHOST + URL.API.timeBlock

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
      const response = await axios.post(editTBApiUrl, {timeblockID: receivedData.timeblockID, user, ...formData})
      console.log("response", response)
      // Redirect to a page showing the newly created time block
      navigate(`/home`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
    <div className="container login-form-container">
      <h2 className="login-form-title">EditTimeBlock Time Block</h2>

      <div className="login-input-container">
        <form onSubmit={handleSubmit}>
          <div className="login-input-container">
            <label className="login-label" htmlFor="name">Name</label>
            <input
              className="login-input-field"
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={formData.name}
              required
            />
          </div>
          <div className="login-input-container">
            <label className="login-label" htmlFor="startDate">Start Date</label>
            <input
              className="login-input-field"
              type="datetime-local"
              name="startDate"
              id="startDate"
              onChange={handleChange}
              value={formData.startDate}
              required
            />
          </div>
          <div className="login-input-container">
            <label className="login-label" htmlFor="endDate">End Date</label>
            <input
              className="login-input-field"
              type="datetime-local"
              name="endDate"
              id="endDate"
              onChange={handleChange}
              value={formData.endDate}
              required
            />
          </div>
          <div className="login-input-container">
            <label className="login-label" htmlFor="endDate">ClientID</label>
            <input
              className="login-input-field"
              type="text"
              name="clientID"
              id="clientID"
              onChange={handleChange}
              value={formData.clientID}
            />
          </div>
          <div className="login-input-container">
            <button className="btn btn-primary" type="submit">Update timeblock</button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default EditTimeBlock
