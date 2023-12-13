import React, {useEffect, useState} from 'react';
import './styles.css';
import axios from 'axios'
import { useAuth } from '../../context/AuthContext.js' // Import the useAuth hook
import { getEndpointURL } from '../../utils/getEndpointURL'

const editTBApiUrl = getEndpointURL("editTimeBlock")// URL.LOCALHOST + URL.API.editTimeBlock

const Popup = ({ show, setShow, data, events, children, deleteTimeblock }) => {
  const [ isPromptOpen, setIsPromptOpen ] = useState(false)
  const { user } = useAuth()
  const [ error, setError ] = useState('')
  const [ eventsData, setEventsData ] = useState([{}])
  const [ eventData , setEventData ] = useState({
    _id: '',
    name: '',
    startDate: '',
    endDate: '',
    createdBy: "",
    clientID: ''
  })

  const localDate = eventData.startDate
    ? new Date(eventData.startDate).toLocaleDateString().split("/").reverse().join("-") + "T" + new Date(eventData.startDate).toLocaleTimeString()
    : ""

  useEffect(() => {
    console.log("receivedData", data)
    setEventData(JSON.parse(data ?? "{}"))
  }, [data])

  useEffect(() => {
    setEventsData(events)
  }, [events])

  useEffect(() => {
    setIsPromptOpen(show);
  }, [show])

  const handleChange = (e) => {
    if (e.target.name === "startDate") {
      const startDate = new Date(e.target.value)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
      setEventData({
        ...eventData,
        startDate,
        endDate,
      })
      return
    } else {
      setEventData({
        ...eventData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const onClose = (e) => {
    //e.stopPropagation();
    setShow(false);
  }

  const deleteElement = async (e) => {
    deleteTimeblock(eventData._id)
    onClose()
  }

  const isOverlap = (event, eventsList) => {
    const start = new Date(event.startDate).getTime();
    const end = new Date(event.endDate).getTime();

    for (const existingEvent of eventsList) {
        const existingStart = new Date(existingEvent.startDate).getTime();
        const existingEnd = new Date(existingEvent.endDate).getTime();

        if (start < existingEnd && end > existingStart) {
            return true; // Overlap found
        }
    }

    return false; // No overlap found
}


  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(e, eventData)

    if (isOverlap(eventData, eventsData)) {
      setError("El bloque seleccionado coincide con otro evento. \nPor favor, seleccione otro bloque (1 hora mínimo)")
      return
    }

    try {
      console.log('handleSubmit', eventData)
      const response = await axios.post(editTBApiUrl, {timeblockID: eventData._id, user, ...eventData})
      console.log(response.data)
      setShow(false)
    } catch (error) {
      setError(error.response?.data?.message)
      console.error(error)
    }
  }

  return (
    <>
      {
        show && isPromptOpen
        ? (
          <div className="prompt-window">
            <div className="prompt-content">
              <h2>Editar cita</h2>
              <p style={{ color: 'red' }}>{error}</p>

              <div className="">
                <form onSubmit={ handleSubmit }>
                  <div className="login-input-container">
                    <label className="" htmlFor="name">Nombre</label>
                    <input
                      className="login-input-field"
                      type="text"
                      name="name"
                      id="name"
                      onChange={handleChange}
                      value={eventData.name}
                      required
                    />
                  </div>
                  <div className="login-input-container">
                    <label className="" htmlFor="startDate">Fecha</label>
                    <input
                      className="login-input-field"
                      type="datetime-local"
                      name="startDate"
                      id="startDate"
                      onChange={handleChange}
                      value={ localDate }
                      required
                    />
                  </div>
                  <div className="login-input-container">
                    <button className="btn btn-primary" type="submit">Actualizar cita</button>
                  </div>
                  <div>
                    <button className="btn btn-danger login-input-container" onClick={ deleteElement }>Borrar</button>
                  </div>
                </form>
              </div>

              <span className="close-btn" onClick={onClose}>
                &times;
              </span>
              <div>
                {children}
              </div>
            </div>
          </div>
        ) : null
      }
    </>)
};

export default Popup;
