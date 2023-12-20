import { useEffect, useState } from 'react'

const GetDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDeviceType = () => {
      const mediaQuery = window.matchMedia('(max-width: 768px)') // Set your mobile breakpoint here
      setIsMobile(mediaQuery.matches)
    }

    checkDeviceType()
    window.addEventListener('resize', checkDeviceType)

    return () => {
      window.removeEventListener('resize', checkDeviceType)
    }
  }, [])

  return { isMobile }
}

export default GetDeviceType
