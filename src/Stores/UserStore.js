import { mockPosts, mockUsers } from '@/Models'
import {
  blockUser,
  getBlockedUsers,
  getUserInfo,
  getUserPosts,
  unblockUser,
  updateUserInfo,
} from '@/Services/Api'
import { uploadImage } from '@/Services/Api/Upload'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable, toJS } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
import { diaLogStore } from '.'
export default class UserStore {
  isLogged = false
  userInfo = {}
  passcode = '123456'
  passcodeEnabled = true
  bookmarkPosts = []
  blockedUsers = []
  hiddenCommentIds = {}
  hiddenMessageIds = {}
  mutedMessageNotificationIds = {}
  posts = []
  postPage = 1
  loadingPosts = false
  loadingMorePosts = false
  constructor() {
    makeAutoObservable(this)
    makePersistExcept(this, 'UserStore', [
      'loadingPosts',
      'loadingMorePosts',
      'postPage',
    ])
  }
  *fetchUserInfo() {
    try {
      // fetch user info
      const { data } = yield getUserInfo(this.userInfo.user_id)
      this.userInfo = data
    } catch (e) {
      this.userInfo = mockUsers[0]
      console.log({
        fetchUserInfo: e,
      })
    }
  }
  *fetchPosts(loadMore) {
    try {
      if (!loadMore) {
        this.loadingPosts = true
      } else {
        this.loadingMorePosts = true
      }
      const { data } = yield getUserPosts(this.userInfo.user_id, this.postPage)
      if (!loadMore) {
        this.posts = data
      } else {
        this.posts = [...this.posts, ...data]
      }
      this.postPage += 1
    } catch (e) {
      this.posts = mockPosts
      console.log({
        fetchPosts: e,
      })
    }
  }
  *fetchBlockedUsers() {
    try {
      const response = yield getBlockedUsers()
      if (response.status === 'OK') {
        this.blockedUsers = response.data
      }
    } catch (e) {
      console.log({
        fetchBlockedUsers: e,
      })
    }
  }
  *blockUser(user) {
    try {
      this.blockedUsers = [...this.blockedUsers, user]
      const response = yield blockUser(user.user_id)
      if (response?.status !== 'OK') {
        this.blockedUsers = this.blockedUsers.filter(
          blockedUser => blockedUser.user_id !== user.user_id,
        )
        diaLogStore.showErrorDiaLog()
      }
    } catch (e) {
      console.log({
        blockUser: e,
      })
      diaLogStore.showErrorDiaLog()
    }
  }
  *unblockUser(user) {
    try {
      this.blockedUsers = this.blockedUsers.filter(
        blockedUser => blockedUser.user_id !== user.user_id,
      )
      const response = yield unblockUser(user.user_id)
      if (response?.status !== 'OK') {
        this.blockedUsers = [...this.blockedUsers, user]
      }
    } catch (e) {
      console.log({
        blockUser: e,
      })
      diaLogStore.showErrorDiaLog()
    }
  }
  *updateUserInfo(userInfo) {
    try {
      const preUserInfo = toJS(this.userInfo)
      this.userInfo = {
        ...this.userInfo,
        ...userInfo,
      }
      const response = yield updateUserInfo(userInfo)
      if (response?.status !== 'OK') {
        this.userInfo = preUserInfo
        diaLogStore.showErrorDiaLog()
      }
    } catch (e) {
      console.log({
        updateUserInfo: e,
      })
      diaLogStore.showErrorDiaLog()
    }
  }
  *updateProfileImage(image, isCover = false) {
    try {
      const preImage = isCover
        ? this.userInfo.cover_url
        : this.userInfo.avatar_url
      if (isCover) {
        this.userInfo.cover_url = image.uri
      } else {
        this.userInfo.avatar_url = image.uri
      }
      const response = yield uploadImage(image.uri, image.mimeType)
      if (response?.status === 'OK') {
        const url = response?.data?.url
        yield this.updateUserInfo(
          isCover ? { cover_url: url } : { avatar_url: url },
        )
      } else {
        diaLogStore.showErrorDiaLog()
        // revert
        if (isCover) {
          this.userInfo.cover_url = preImage
        } else {
          this.userInfo.avatar_url = preImage
        }
      }
    } catch (e) {
      console.log({
        updateProfileImage: e,
      })
      diaLogStore.showErrorDiaLog()
    }
  }
  setUserInfo(userInfo, isLogged = true) {
    this.userInfo = userInfo
    this.isLogged = isLogged
  }
  logout() {
    this.userInfo = {}
    this.isLogged = false
  }
  setPasscode(passcode) {
    this.passcode = passcode
    this.passcodeEnabled = true
  }
  disablePasscode() {
    this.passcodeEnabled = false
  }
  addBookmarkPost(post) {
    this.bookmarkPosts = [...this.bookmarkPosts, post]
  }
  removeBookmarkPost(postId) {
    this.bookmarkPosts = this.bookmarkPosts.filter(
      post => post.post_id !== postId,
    )
  }
  isBookmarked(postId) {
    return this.bookmarkPosts.some(post => post.post_id === postId)
  }
  addHiddenComment(commentId) {
    this.hiddenCommentIds[commentId] = true
  }
  removeHiddenComment(commentId) {
    delete this.hiddenCommentIds[commentId]
  }
  isHiddenComment(commentId) {
    return !!this.hiddenCommentIds[commentId]
  }
  addHiddenMessage(messageId) {
    this.hiddenMessageIds[messageId] = true
  }
  removeHiddenMessage(messageId) {
    delete this.hiddenMessageIds[messageId]
  }
  isHiddenMessage(messageId) {
    return !!this.hiddenMessageIds[messageId]
  }
  muteMessageNotification(userId) {
    //TODO: call localnotification api to mute
    this.mutedMessageNotificationIds[userId] = true
  }
  unmuteMessageNotification(userId) {
    //TODO: call localnotification api to unmute
    delete this.mutedMessageNotificationIds[userId]
  }
  isMutedMessageNotification(userId) {
    return !!this.mutedMessageNotificationIds[userId]
  }

  isBlocked(userId) {
    return this.blockedUsers.some(user => user.user_id === userId)
  }
  findPostById(postId) {
    return this.posts.find(post => post.post_id === postId)
  }
  addPostComment(postId, comment) {
    const post = this.findPostById(postId)
    if (post) {
      post.comments = [comment, ...post.comments]
    }
  }
  updatePostComment(postId, commentId, comment) {
    const post = this.findPostById(postId)
    if (post) {
      const index = post.comments.findIndex(
        item => item.comment_id === commentId,
      )
      if (index > -1) {
        post.comments[index] = { ...post.comments[index], ...comment }
      }
    }
  }
  deletePostComment(postId, commentId) {
    const post = this.findPostById(postId)
    if (post) {
      post.comments = post.comments.filter(
        item => item.comment_id !== commentId,
      )
    }
  }
  reactPost(postId) {
    const post = this.findPostById(postId)
    if (post) {
      const isReacted = post.reactions.some(
        r => r.reacted_by.user_id === this.userInfo.user_id,
      )
      if (!isReacted) {
        post.reactions = [
          {
            reacted_by: toJS(this.userInfo),
          },
          ...post.reactions,
        ]
      }
    }
  }
  unReactPost(postId) {
    const post = this.findPostById(postId)
    if (post) {
      post.reactions = post.reactions.filter(
        r => r.reacted_by.user_id !== this.userInfo.user_id,
      )
    }
  }
  isReactedPost(postId) {
    const post = this.findPostById(postId)
    if (post) {
      return post.reactions.some(
        r => r.reacted_by.user_id === this.userInfo.user_id,
      )
    }
    return false
  }
  // check for hydration (required)
  get isHydrated() {
    return isHydrated(this)
  }
  // hydrate the store (required)
  async hydrateStore() {
    await hydrateStore(this)
  }
}
