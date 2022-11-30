import { CommentStatus } from '@/Models'
import {
  deleteComment,
  sendComment,
  sendReactPost,
  sendUnReactPost,
  updateComment,
} from '@/Services/Api'
import { toJS } from 'mobx'
import { chatStore, homeStore, notiStore, profileStore, userStore } from '.'

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
export const reactPost = postId => {
  homeStore.reactPost(postId)
  userStore.reactPost(postId)
  profileStore.reactPost(postId)
}
export const unReactPost = postId => {
  homeStore.unReactPost(postId)
  userStore.unReactPost(postId)
  profileStore.unReactPost(postId)
}
export const isReactedPost = postId => {
  return (
    homeStore.isReactedPost(postId) ||
    userStore.isReactedPost(postId) ||
    profileStore.isReactedPost(postId)
  )
}
export const initData = () => {
  homeStore.fetchPosts()
  homeStore.fetchStories()
  userStore.fetchUserInfo()
  userStore.fetchBlockedUsers()
  userStore.fetchPosts()
  chatStore.initSocket()
  notiStore.fetchNotifcations()
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
export const updateCommentRequest = async (postId, commentId, message) => {
  try {
    updatePostComment(postId, commentId, {
      comment: message,
      status: CommentStatus.UPDATING,
    })
    const response = await updateComment(postId, commentId, message)
    if (response.status === 'OK') {
      updatePostComment(postId, commentId, {
        status: CommentStatus.SENT,
      })
    } else {
      updatePostComment(postId, commentId, {
        status: CommentStatus.ERROR_UPDATE,
      })
    }
  } catch (e) {
    updatePostComment(postId, commentId, {
      status: CommentStatus.ERROR_UPDATE,
    })
  }
}
export const deleteCommentRequest = async (postId, commentId, comment) => {
  try {
    deletePostComment(postId, commentId)
    if (comment.status !== CommentStatus.ERROR) {
      const response = await deleteComment(postId, commentId)
      if (response?.status !== 'OK') {
        addPostComment(postId, comment)
      }
    }
  } catch (e) {
    addPostComment(postId, comment)
  }
}
export const updatePostCommentRequest = async (postId, commentId, comment) => {
  try {
    updatePostComment(postId, commentId, {
      status: CommentStatus.UPDATING,
    })
    const response = await updateComment(postId, commentId, comment)
    if (response.status === 'OK') {
      updatePostComment(postId, commentId, {
        status: CommentStatus.SENT,
      })
    } else {
      updatePostComment(postId, commentId, {
        status: CommentStatus.ERROR_UPDATE,
      })
    }
  } catch (e) {
    updatePostComment(postId, commentId, {
      status: CommentStatus.ERROR_UPDATE,
    })
  }
}
export const reactRequest = async (postId, isUnReact) => {
  try {
    if (isUnReact) {
      unReactPost(postId)
    } else {
      reactPost(postId)
    }
    let response
    if (isUnReact) {
      response = await sendUnReactPost(postId)
    } else {
      response = await sendReactPost(postId)
    }
    if (response.status !== 'OK') {
      console.log({ reactRequestError: response })
    }
  } catch (e) {
    console.log({ reactRequestError: e })
  }
}
