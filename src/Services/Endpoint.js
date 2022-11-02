import { Config } from '@/Config'

export default () => {
  const baseUrl = Config.BASE_URL
  const apiUrl = Config.API_URL
  const socketUrl = Config.SOCKET_URL
  return {
    baseUrl,
    apiUrl,
    socketUrl,
    //auth
    login: `${apiUrl}/login`,
    logout: `${apiUrl}/logout`,
    register: `${apiUrl}/register`,
    forgotPassword: `${apiUrl}/forgot-password`,
    resetPassword: `${apiUrl}/reset-password`,
    //posts
    getHomePosts: `${apiUrl}/posts`,
    getPostDetail: id => `${apiUrl}/posts/${id}`,
    getProfile: `${apiUrl}/users/{id}`,
    getProfilePosts: (id, page) => `${apiUrl}/users/${id}/posts?page=${page}`,
    searchPosts: `${apiUrl}/search/posts`,
    createPost: `${apiUrl}/posts`,
    updatePostMessage: `${apiUrl}/posts/{id}`,
    deletePost: `${apiUrl}/posts/{id}`,
    likePost: `${apiUrl}/posts/{id}/like`,
    unlikePost: `${apiUrl}/posts/{id}/unlike`,
    sendComment: postId => `${apiUrl}/posts/${postId}/comments`,
    deleteComment: (postId, commentId) =>
      `${apiUrl}/posts/${postId}/comments/${commentId}`,
    //stories
    getStories: `${apiUrl}/stories`,
    getUserStories: `${apiUrl}/users/{id}/stories`,
    createStory: `${apiUrl}/stories`,
    deleteStoryMedia: `${apiUrl}/stories/{id}/medias/{media_id}`,
    //notifications
    getNotifications: `${apiUrl}/notifications`,
    deleteNotification: `${apiUrl}/notifications/{id}`,
    //users
    searchUsers: `${apiUrl}/search/users`,
    updateUserInfo: `${apiUrl}/user`,
    updatePassword: `${apiUrl}/user/password`,
    getUserInfo: id => `${apiUrl}/users/${id}`,
    //chat
    getConversations: `${apiUrl}/conversations`,
    getConversationDetail: `${apiUrl}/conversations/{id}`,
    createConversation: `${apiUrl}/conversations`,
    deleteConversation: `${apiUrl}/conversations/{id}`,
  }
}
