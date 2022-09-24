import Config from './Config'

export default () => {
  const baseUrl = Config.BASE_URL
  const apiUrl = Config.API_URL
  const socketUrl = Config.SOCKET_URL
  return {
    baseUrl,
    apiUrl,
    socketUrl,
    homeInfo: `${baseUrl}/home`,
    countries: baseUrl + 'countries/countries',
  }
}
