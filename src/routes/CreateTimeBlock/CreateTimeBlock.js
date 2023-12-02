import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext.js' // Import the useAuth hook
import { URL } from '../../constants.js'

const apiUrl = URL.LOCALHOST + URL.API.saveTimeBlock

const CreateTimeBlock = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({})

  useEffect(() => {
    console.log('CreateTimeBlock', user, user._id)
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    console.log(userTimeZone);
    if (!user) {
      navigate('/login')
    } else {
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        timezone: userTimeZone,
        createdBy: user._id //|| "650f416197c0c31963b71f2a", // This should be the user's ID
      })
    }
  }, [])


  // Function to handle form input changes
  const handleChange = (e) => {
    console.log(e.target.name, e.target.value)
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
      const response = await axios.post(apiUrl, {formData, user})
      console.log("response", response)
      navigate(`/home`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
    <div className="container login-form-container">
      <h1 className="login-form-title">Create Time Block</h1>

      <div className="login-input-container">
        <form onSubmit={handleSubmit}>
          <div className="login-input-container">
            <label className="login-label" htmlFor="name">Name
            <input
              className="login-input-field"
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={formData.name}
              required
            /> </label>
          </div>
          <div className="login-input-container">
            <label className="login-label" htmlFor="startDate">Start Date
            <input
              className="login-input-field"
              type="datetime-local"
              name="startDate"
              id="startDate"
              onChange={handleChange}
              value={formData.startDate}
              required
            /> </label>
          </div>
          <div className="login-input-container">
            <label className="login-label" htmlFor="endDate">End Date
            <input
              className="login-input-field"
              type="datetime-local"
              name="endDate"
              id="endDate"
              onChange={handleChange}
              value={formData.endDate}
              required
            /> </label>
          </div>
          <div>
            {/* For createdBy, you may need to get the user's ID from your authentication context */}
            {/*<input type="hidden" name="createdBy" value=User's ID />*/}
          </div>
          <div className="login-input-container" style={{marginTop: "50px"}}>
            <button type="submit" className="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default CreateTimeBlock
