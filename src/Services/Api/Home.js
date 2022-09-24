import { generateRequest, Method } from '../Axios'
import Endpoint from '../Endpoint'

export const fetchCountries = () =>
  generateRequest(Endpoint.countries, Method.GET)
