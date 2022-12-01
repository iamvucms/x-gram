import { request, Method } from '../Axios'
import Endpoint from '../Endpoint'

export const getNotifications = page =>
  request(Endpoint().getNotifications(page), Method.GET, { page })
export const deleteNotification = id =>
  request(Endpoint().deleteNotification(id), Method.DELETE)
