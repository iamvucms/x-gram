import { request, Method } from '../Axios'
import Endpoint from '../Endpoint'

export const getStories = page =>
  request(Endpoint().getStories, Method.GET, { page })

export const getPosts = page =>
  request(Endpoint().getHomePosts(page), Method.GET)

export const getPostDetail = id =>
  request(Endpoint().getPostDetail(id), Method.GET)

export const sendReactPost = id =>
  request(Endpoint().reactPost(id), Method.POST)

export const sendUnReactPost = id =>
  request(Endpoint().unReactPost(id), Method.POST)

export const sendComment = (postId, data) =>
  request(Endpoint().sendComment(postId), Method.POST, data)

export const updateComment = (postId, commentId, data) =>
  request(Endpoint().updateComment(postId, commentId), Method.POST, data)

export const deleteComment = (postId, commentId) =>
  request(Endpoint().deleteComment(postId, commentId), Method.DELETE)
