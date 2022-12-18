import { mockPosts, mockStories, Post, Story } from '@/Models'
import { getPostDetail, getPosts, getStories } from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable, toJS } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
import { userStore } from '.'

export default class HomeStore {
  stories: Story[] = []
  posts: Post[] = []
  additionalPosts: Post[] = []
  storyPage = 1
  postPage = 1
  loadingStories = false
  loadingPosts = false
  loadingMorePosts = false
  loadingMoreStories = false
  constructor() {
    makeAutoObservable(this)
    makePersistExcept(this, 'HomeStore', [
      'loadingMorePosts',
      'loadingStories',
      'loadingPosts',
      'loadingMoreStories',
      'storyPage',
      'postPage',
    ])
  }
  *fetchStories(loadMore?: boolean) {
    try {
      if (!loadMore) {
        this.loadingStories = true
      } else {
        this.loadingMoreStories = true
      }
      const { data } = yield getStories(this.storyPage)
      if (!loadMore) {
        this.stories = data
      } else {
        this.stories = [...this.stories, ...data]
      }
      this.storyPage += 1
    } catch (e) {
      this.stories = mockStories
      console.log({
        fetchStories: e,
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
      const { data } = yield getPosts(this.postPage)
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
  *fetchAndAddAdditionalPosts(postId) {
    try {
      const { data } = yield getPostDetail(postId)
      this.additionalPosts = [...this.additionalPosts, data]
    } catch (e) {
      console.log({
        fetchAndAddAdditionalPosts: e,
      })
    }
  }
  findPostById(postId) {
    return (
      this.posts.find(post => post.post_id === postId) ||
      this.additionalPosts.find(post => post.post_id === postId)
    )
  }
  addPost(post: Post) {
    this.posts = [post, ...this.posts]
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
  deletePost(postId) {
    this.posts = this.posts.filter(post => post.post_id !== postId)
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
        r => r.reacted_by.user_id === userStore.userInfo.user_id,
      )
      if (!isReacted) {
        post.reactions = [
          {
            reacted_by: toJS(userStore.userInfo),
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
        r => r.reacted_by.user_id !== userStore.userInfo.user_id,
      )
    }
  }
  isReactedPost(postId) {
    const post = this.findPostById(postId)
    if (post) {
      return post.reactions.some(
        r => r.reacted_by.user_id === userStore.userInfo.user_id,
      )
    }
    return false
  }
  get isHydrated() {
    return isHydrated(this)
  }
  async hydrateStore() {
    await hydrateStore(this)
  }
}
