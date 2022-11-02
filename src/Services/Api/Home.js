import { request, Method } from '../Axios'
import Endpoint from '../Endpoint'

export const getStories = page =>
  request(Endpoint().getStories, Method.GET, { page })

export const getPosts = () => request(Endpoint().getHomePosts, Method.GET)

export const getPostDetail = id =>
  request(Endpoint().getPostDetail(id), Method.GET)

export const sendComment = (postId, data) =>
  request(Endpoint().sendComment(postId), Method.POST, data)

export const deleteComment = (postId, commentId) =>
  request(Endpoint().deleteComment(postId, commentId), Method.DELETE)
