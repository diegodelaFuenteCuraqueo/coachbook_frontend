import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext' // Import the useAuth hook

const apiUrl = 'http://localhost:5000'

const CreateTimeBlock = () => {
  const navigate = useNavigate()
  const { userId } = useAuth()

  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    createdBy: userId || "650f416197c0c31963b71f2a", // This should be the user's ID
  })

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
      const response = await axios.post(apiUrl+'/api/save-time-block', formData)
      console.log("response", response)
      // Redirect to a page showing the newly created time block
      navigate(`/timeblocks/${response.data._id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Create Time Block</h2>
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
          {/* For createdBy, you may need to get the user's ID from your authentication context */}
          {/*<input type="hidden" name="createdBy" value=User's ID />*/}
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default CreateTimeBlock
