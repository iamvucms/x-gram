import { request, Method } from '../Axios'
import Endpoint from '../Endpoint'

export const searchPosts = (q, tag, page) =>
  request(Endpoint().searchPosts, Method.GET, { q, tag, page })
