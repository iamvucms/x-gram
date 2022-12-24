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
    getHomePosts: (page = 1) => `${apiUrl}/posts?page=${page}`,
    getPostDetail: id => `${apiUrl}/posts/${id}`,
    getProfile: `${apiUrl}/users/{id}`,
    getProfilePosts: (id, page = 1) =>
      `${apiUrl}/users/${id}/posts?page=${page}`,
    searchPosts: `${apiUrl}/search/posts`,
    createPost: `${apiUrl}/posts`,
    updatePost: id => `${apiUrl}/posts/${id}`,
    updatePostMessage: `${apiUrl}/posts/{id}`,
    deletePost: id => `${apiUrl}/posts/${id}`,
    reactPost: postId => `${apiUrl}/posts/${postId}/like`,
    unReactPost: postId => `${apiUrl}/posts/${postId}/unlike`,
    sendComment: postId => `${apiUrl}/posts/${postId}/comments`,
    updateComment: (postId, commentId) =>
      `${apiUrl}/posts/${postId}/comments/${commentId}`,
    deleteComment: (postId, commentId) =>
      `${apiUrl}/posts/${postId}/comments/${commentId}`,
    //stories
    getStories: `${apiUrl}/stories`,
    getUserStories: `${apiUrl}/users/{id}/stories`,
    createStory: `${apiUrl}/stories`,
    deleteStoryMedia: `${apiUrl}/stories/{id}/medias/{media_id}`,
    //notifications
    getNotifications: (page = 1) => `${apiUrl}/notifications?page=${page}`,
    deleteNotification: id => `${apiUrl}/notifications/${id}`,
    //users
    searchUsers: (q, page = 1) => `${apiUrl}/search/users?q=${q}&page=${page}`,
    updateUserInfo: `${apiUrl}/users`,
    updatePassword: `${apiUrl}/users/password`,
    getUserInfo: id => `${apiUrl}/users/${id}`,
    getBlockedUsers: `${apiUrl}/users/blocked-users`,
    blockUser: id => `${apiUrl}/users/blocked-users/${id}`,
    unBlockUser: id => `${apiUrl}/users/blocked-users/${id}/unblock`,
    followUser: id => `${apiUrl}/users/follow/${id}`,
    unFollowUser: id => `${apiUrl}/users/unfollow/${id}`,
    removeFollower: id => `${apiUrl}/users/removefollower/${id}`,
    //chat
    getConversations: page => `${apiUrl}/conversations?page=${page}`,
    getMessages: id => `${apiUrl}/conversations/${id}/messages`,
    getMediaMessages: id => `${apiUrl}/conversations/${id}/media-messages`,
    createConversation: `${apiUrl}/conversations`,
    deleteConversation: id => `${apiUrl}/conversations/${id}`,
    //upload
    upload: `${apiUrl}/uploads`,
  }
}
