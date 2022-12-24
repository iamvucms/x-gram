import { Notification } from '@/Models/Mock'
import { NotificationType } from '@/Models/Enum'
import { Config } from '@/Config'
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

export const getImageMimeType = (uri: string) => {
  if (uri.endsWith('.png')) {
    return 'image/png'
  }
  if (uri.endsWith('.jpg')) {
    return 'image/jpeg'
  }
  if (uri.endsWith('.jpeg')) {
    return 'image/jpeg'
  }
  if (uri.endsWith('.gif')) {
    return 'image/gif'
  }
  return 'image/jpeg'
}

export const getMediaUri = (path: string = '') => {
  const isFullUri = path.startsWith('http') || path.startsWith('file')
  return isFullUri ? path : `${Config.API_URL}${path}`
}
