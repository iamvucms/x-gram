import { homeStore, profileStore, userStore } from '.'

export const findPostById = postId => {
  return (
    homeStore.findPostById(postId) ||
    userStore.findPostById(postId) ||
    profileStore.findPostById(postId)
  )
}
