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
