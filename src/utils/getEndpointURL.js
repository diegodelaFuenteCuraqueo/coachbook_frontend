import { URL } from '../constants'

export function getEndpointURL(apiRoute) {
  const route = Object.keys(URL.API).includes(apiRoute) ? apiRoute : '/'

  const hostname = window.location.hostname
  const host = (hostname === 'localhost' || hostname === '127.0.0.1')
                ? URL.LOCALHOST
                : URL.VERCEL_HOST

  return host + URL.API[route]
}
