import { getUserPosts } from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
export default class UserStore {
  isLogged = false
  userInfo = {}
  passcode = '123456'
  passcodeEnabled = true
  bookmarkPosts = []
  posts = []
  postPage = 1
  loadingPosts = false
  loadingMorePosts = false
  constructor() {
    makeAutoObservable(this)
    makePersistExcept(this, 'UserStore', [])
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
    this.bookmarkPosts = this.bookmarkPosts.filter(post => post.id !== postId)
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
      console.log({
        fetchPosts: e,
      })
    }
  }
  findPostById(postId) {
    return this.posts.find(post => post.post_id === postId)
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
