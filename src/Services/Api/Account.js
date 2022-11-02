import { Method, request } from '../Axios'
import Endpoint from '../Endpoint'

export const getUserPosts = (id, page) =>
  request(Endpoint().getProfilePosts(id, page), Method.GET)

export const getUserInfo = id => request(Endpoint().getUserInfo(id), Method.GET)
