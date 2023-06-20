import { CommentStatus, Post, PostStatus, PrivacyType } from '@/Models'
import {
  deleteComment,
  sendComment,
  sendDeletePost,
  sendPost,
  sendReactPost,
  sendStory,
  sendUnReactPost,
  sendUpdatePost,
  updateComment,
  uploadImage,
  uploadVideo,
} from '@/Services/Api'
import { toJS } from 'mobx'
import {
  chatStore,
  diaLogStore,
  homeStore,
  notiStore,
  profileStore,
  userStore,
} from '.'

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
export const addPost = post => {
  homeStore.addPost(post)
  userStore.addPost(post)
}
export const updatePost = (postId: string, post: Partial<Post>) => {
  homeStore.updatePost(postId, post)
  userStore.updatePost(postId, post)
}
export const deletePostById = postId => {
  homeStore.deletePost(postId)
  userStore.deletePost(postId)
}
export const initData = () => {
  userStore.fetchUserInfo()
  userStore.fetchPosts()
  userStore.fetchBlockedUsers()
  homeStore.fetchPosts()
  homeStore.fetchStories()
  chatStore.initSocket()
  notiStore.fetchNotifcations()
}
//Async Action
export const sendCommentRequest = async (postId, message, isImage, retryId) => {
  const commentId = retryId || `cmt_${Math.random()}`
  const isNewComment = !retryId
  try {
    if (isImage) {
      const extension = message.split('.').pop()
      const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg'
      const response = await uploadImage(message, mimeType)
      if (response.status === 'OK') {
        message = response.data[0].url
      }
    }
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
    const response = await sendComment(postId, {
      data: message,
      is_image: isImage,
    })
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
    const response = await updateComment(postId, commentId, {
      data: message,
    })
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
export const createStory = async (medias, onDone) => {
  try {
    const uploadedMedias = await Promise.all(
      medias.map(async m => {
        const isVideo = m.uri.includes('video')
        const response = isVideo
          ? await uploadVideo(m.uri, m.mimeType)
          : await uploadImage(m.uri, m.mimeType)
        if (response.status === 'OK') {
          const media = response.data[0]
          return {
            url: media.url,
            is_video: isVideo,
          }
        } else {
          throw new Error('Upload media error')
        }
      }),
    )
    const response = await sendStory({
      medias: uploadedMedias,
    })
    if (response?.status === 'OK') {
      homeStore.fetchStories()
      onDone()
    }
  } catch (e) {
    console.log({ createStoryError: e })
  }
}
export const createPost = async (message, medias, privacy, onDone) => {
  try {
    const tags = []
    const uploadedMedias = await Promise.all(
      medias.map(async m => {
        const isVideo = m.mimeType.includes('video')
        const response = isVideo
          ? await uploadVideo(m.uri, m.mimeType)
          : await uploadImage(m.uri, m.mimeType)
        if (response.status === 'OK') {
          const media = response.data[0]
          if (!tags.includes(media.tag)) {
            tags.push(media.tag)
          }
          return {
            url: media.url,
            is_video: isVideo,
          }
        } else {
          throw new Error('Upload media error')
        }
      }),
    )
    const post = {
      message,
      medias: uploadedMedias,
      tags,
      privacy,
    }
    const response = await sendPost(post)
    if (response?.status !== 'OK') {
      diaLogStore.showErrorDiaLog({ message: response?.message })
    } else {
      addPost(response.data)
      onDone && onDone()
    }
  } catch (e) {
    diaLogStore.showErrorDiaLog({ message: e.message })
    console.log({ createPostError: e })
  }
}
export const deletePost = async postId => {
  try {
    const response = await sendDeletePost(postId)
    if (response?.status === 'OK') {
      deletePostById(postId)
    } else {
      diaLogStore.showErrorDiaLog()
    }
  } catch (e) {
    diaLogStore.showErrorDiaLog()
  }
}
export const updatePostRequest = async (
  postId: string,
  message: string,
  privacy: PrivacyType,
  onDone?: () => void,
) => {
  try {
    const response = await sendUpdatePost(postId, {
      message,
      privacy,
    })
    if (response?.status === 'OK') {
      updatePost(postId, {
        message,
        privacy,
      })
      onDone && onDone()
    } else {
      diaLogStore.showErrorDiaLog()
    }
  } catch (e) {
    diaLogStore.showErrorDiaLog()
  }
}
