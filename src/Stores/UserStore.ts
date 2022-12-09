import { mockPosts, mockUsers, Post, User } from '@/Models'
import {
  blockUser,
  followUser,
  getBlockedUsers,
  getUserInfo,
  getUserPosts,
  unblockUser,
  unFollowUser,
  updateUserInfo,
  uploadImage,
} from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable, toJS } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
import { diaLogStore } from '.'
export default class UserStore {
  isLogged = false
  userInfo: User = {} as User
  following: User[] = []
  followers: User[] = []
  passcode = '123456'
  passcodeEnabled = true
  bookmarkPosts: Post[] = []
  blockedUsers: User[] = []
  hiddenCommentIds = {}
  hiddenMessageIds = {}
  mutedMessageNotificationIds = {}
  posts: Post[] = []
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
      // fetch following
    } catch (e) {
      this.userInfo = mockUsers[0]
      this.following = mockUsers.slice(1, 2)
      this.followers = mockUsers.slice(1, 2)
      console.log({
        fetchUserInfo: e,
      })
    }
  }
  *fetchPosts(loadMore?: boolean) {
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
    const preUserInfo = toJS(this.userInfo)
    this.userInfo = {
      ...this.userInfo,
      ...userInfo,
    }
    try {
      const response = yield updateUserInfo(userInfo)
      if (response?.status !== 'OK') {
        this.userInfo = preUserInfo
        diaLogStore.showErrorDiaLog()
      }
    } catch (e) {
      console.log({
        updateUserInfo: e,
      })
      this.userInfo = preUserInfo
      diaLogStore.showErrorDiaLog()
    }
  }
  *updateProfileImage(image, isCover = false) {
    const preImage = isCover
      ? this.userInfo.cover_url
      : this.userInfo.avatar_url
    try {
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
      // revert
      if (isCover) {
        this.userInfo.cover_url = preImage
      } else {
        this.userInfo.avatar_url = preImage
      }
      console.log({
        updateProfileImage: e,
      })
      diaLogStore.showErrorDiaLog()
    }
  }
  *followUser(user) {
    try {
      const response = yield followUser(user.user_id)
      if (response?.status === 'OK') {
        this.addFollowing(toJS(user))
      }
    } catch (e) {
      console.log({
        followUser: e,
      })
    }
  }
  *unfollowUser(user) {
    try {
      const response = yield unFollowUser(user.user_id)
      if (response?.status === 'OK') {
        this.removeFollowing(user.user_id)
      }
    } catch (e) {
      console.log({
        unfollowUser: e,
      })
    }
  }
  addPost(post: Post) {
    this.posts = [post, ...this.posts]
  }
  deletePost(postId) {
    this.posts = this.posts.filter(post => post.post_id !== postId)
  }
  updatePost(postId: string, post: Partial<Post>) {
    const index = this.posts.findIndex(post => post.post_id === postId)
    if (index !== -1) {
      this.posts[index] = {
        ...this.posts[index],
        ...post,
      }
    }
  }
  setUserInfo(userInfo, isLogged = true) {
    this.userInfo = userInfo
    this.isLogged = isLogged
  }
  logout() {
    this.userInfo = {} as User
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
  isFollowing(userId) {
    return this.following.some(user => user.user_id === userId)
  }
  isFollowingMe(userId) {
    return this.followers.some(user => user.user_id === userId)
  }
  addFollowing(user) {
    this.following = [user, ...this.following]
  }
  removeFollowing(userId) {
    this.following = this.following.filter(user => user.user_id !== userId)
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
