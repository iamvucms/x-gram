import { Notification } from '@/Models/Mock'
import { NotificationType } from '@/Models/Enum'
export const capitializeFirstLetter = (str = '') => {
  return str === null ? '' : str.charAt(0).toUpperCase() + str.slice(1)
}
export const capitalize = (str = '') => {
  return str === null
    ? ''
    : str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
}
export const getNotificationText = (notification: Notification, t) => {
  switch (notification.type) {
    case NotificationType.REACT:
      return t('notifications.so_loved_your_post', {
        replace: {
          full_name: notification.user.full_name,
        },
      })
    case NotificationType.COMMENT:
      return t('notifications.so_commented_your_post', {
        replace: {
          full_name: notification.user.full_name,
          comment: notification.reference.comment,
        },
      })
    case NotificationType.MENTION_IN_COMMENT:
      return t('notifications.so_mention_you_in_comment', {
        replace: {
          full_name: notification.user.full_name,
          comment: notification.reference.comment,
        },
      })
    case NotificationType.MENTION_IN_POST:
      return t('notifications.so_mention_you_in_post', {
        replace: {
          full_name: notification.user.full_name,
          post_message: notification.reference.message,
        },
      })
    case NotificationType.FOLLOW:
      return t('notifications.so_followed_you', {
        replace: {
          full_name: notification.user.full_name,
        },
      })
    default:
      return ''
  }
}
