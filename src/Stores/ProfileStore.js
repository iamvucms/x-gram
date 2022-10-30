import { getUserPosts } from '@/Services/Api'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
export default class ProfileStore {
  profileInfo = {}
  fetching = false
  posts = []
  loadingPosts = false
  postPage = 1
  constructor() {
    makeAutoObservable(this)
  }
  *fetchProfile(userId) {
    this.fetching = true
    // fetch profile
    this.fetching = false
  }
  *fetchPosts(loadMore) {
    try {
      if (!loadMore) {
        this.loadingPosts = true
      } else {
        this.loadingMorePosts = true
      }
      const { data } = yield getUserPosts(
        this.profileInfo.user_id,
        this.postPage,
      )
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
  get isHydrated() {
    return isHydrated(this)
  }
  // hydrate the store (required)
  async hydrateStore() {
    await hydrateStore(this)
  }
}
