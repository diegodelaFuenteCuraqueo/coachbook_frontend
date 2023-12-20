const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false
}

export const DateFormater = (date = new Date()) => {
  const formatedDate = new Date(date)
  return formatedDate.toLocaleDateString("es-ES", options)
}

export const stringToInputDate = (originalDate) => {
  const date = new Date(originalDate)
  const year = date.getFullYear()
  const month = `${(date.getMonth() + 1)}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}