import { Method, request } from '../Axios'
import Endpoint from '../Endpoint'

export const getUserPosts = (id, page) =>
  request(Endpoint().getProfilePosts(id, page), Method.GET)

export const getUserInfo = id => request(Endpoint().getUserInfo(id), Method.GET)

export const getBlockedUsers = () =>
  request(Endpoint().getBlockedUsers, Method.GET)

export const searchUsers = (q, page) => {
  return request(Endpoint().searchUsers(q, page), Method.GET)
}

export const blockUser = id => request(Endpoint().blockUser(id), Method.POST)

export const unblockUser = id =>
  request(Endpoint().unBlockUser(id), Method.POST)

export const updateUserInfo = data =>
  request(Endpoint().updateUserInfo, Method.POST, data)

export const followUser = id => request(Endpoint().followUser(id), Method.POST)
export const unFollowUser = id =>
  request(Endpoint().unFollowUser(id), Method.POST)

export const removeFollower = id =>
  request(Endpoint().removeFollower(id), Method.POST)
