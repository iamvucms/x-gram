import { CommentStatus } from '@/Models'
import { deleteComment, sendComment } from '@/Services/Api'
import { toJS } from 'mobx'
import { homeStore, profileStore, userStore } from '.'

export const findPostById = postId => {
  return (
    homeStore.findPostById(postId) ||
    userStore.findPostById(postId) ||
    profileStore.findPostById(postId)
  )
}
export const addPostComment = (postId, comment) => {
  homeStore.addPostComment(postId, comment)
  userStore.addPostComment(postId, comment)
  profileStore.addPostComment(postId, comment)
}
export const updatePostComment = (postId, commentId, comment) => {
  homeStore.updatePostComment(postId, commentId, comment)
  userStore.updatePostComment(postId, commentId, comment)
  profileStore.updatePostComment(postId, commentId, comment)
}
export const deletePostComment = (postId, commentId) => {
  homeStore.deletePostComment(postId, commentId)
  userStore.deletePostComment(postId, commentId)
  profileStore.deletePostComment(postId, commentId)
}
export const initData = () => {
  homeStore.fetchPosts()
  homeStore.fetchStories()
  userStore.fetchUserInfo()
}
//Async Action
export const sendCommentRequest = async (postId, message, isImage, retryId) => {
  const commentId = retryId || `cmt_${Math.random()}`
  const isNewComment = !retryId
  try {
    const comment = {
      comment_id: commentId,
      commented_by: toJS(userStore.userInfo),
      comment: message,
      is_image: isImage,
      status: CommentStatus.SENDING,
    }
    if (isNewComment) {
      addPostComment(postId, comment)
    } else {
      updatePostComment(postId, commentId, comment)
    }
    const response = await sendComment(postId, comment)
    if (response.status === 'OK') {
      updatePostComment(postId, commentId, {
        comment_id: response.data.comment_id,
        status: CommentStatus.SENT,
      })
    } else {
      updatePostComment(postId, commentId, {
        status: CommentStatus.ERROR,
      })
    }
  } catch (e) {
    updatePostComment(postId, commentId, {
      status: CommentStatus.ERROR,
    })
  }
}
export const deleteCommentRequest = async (postId, commentId, comment) => {
  try {
    deletePostComment(postId, commentId)
    const response = await deleteComment(postId, commentId)
    if (response?.status !== 'OK') {
      addPostComment(postId, comment)
    }
  } catch (e) {
    addPostComment(postId, comment)
  }
}
