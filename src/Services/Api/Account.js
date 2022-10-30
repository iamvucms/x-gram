import { Method, request } from '../Axios'
import Endpoint from '../Endpoint'

export const getUserPosts = (id, page) =>
  request(Endpoint().getProfilePosts(id, page), Method.GET)
