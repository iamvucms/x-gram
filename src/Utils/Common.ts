import { PageName } from '@/Config'
import { NotificationType } from '@/Models/Enum'
import { Notification } from '@/Models/Mock'
import { navigate, navigateToProfile } from '@/Navigators'
import { moderateScale, ResponsiveWidth } from '@/Theme'
import moment from 'moment'
export const randomRgb = () => {
  const o = Math.round,
    r = Math.random,
    s = 255
  return `rgb(${o(r() * s)},${o(r() * s)},${o(r() * s)})`
}

export const caculatePageWidthForPagination = (
  sliderWidth,
  itemWidth,
  itemLength,
  marginHorizontal,
) =>
  itemLength <= 1
    ? 0
    : (itemWidth * itemLength -
        sliderWidth +
        ResponsiveWidth(marginHorizontal) * 2) /
      (itemLength - 1)

export const getHitSlop = (size = 20) => ({
  top: moderateScale(size),
  bottom: moderateScale(size),
  left: moderateScale(size),
  right: moderateScale(size),
})

export const compareTwoStringArray = (arr1: string[], arr2: string[]) => {
  arr1 = arr1.sort()
  arr2 = arr2.sort()
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i += 1) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

export const groupNotificationByDate = (notifications: Notification[]) => {
  const groupedNotification = notifications.reduce((acc, notification) => {
    let date = moment(notification.created_at).format('DD/MM/YYYY')
    if (date === moment().format('DD/MM/YYYY')) {
      date = 'Today'
    } else if (date === moment().subtract(1, 'days').format('DD/MM/YYYY')) {
      date = 'Yesterday'
    }
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(notification)
    return acc
  }, {})
  return groupedNotification
}

export const processNavigationNotification = (notification: Notification) => {
  switch (notification.type) {
    case NotificationType.MENTION_IN_POST:
    case NotificationType.REACT:
      navigate(PageName.PostDetailScreen, {
        postId: notification.post_id,
      })
      break
    case NotificationType.MENTION_IN_COMMENT:
    case NotificationType.COMMENT:
      navigate(PageName.PostDetailScreen, {
        postId: notification.post_id,
        commentId: notification.reference.comment_id,
      })
      break
    case NotificationType.FOLLOW:
      navigateToProfile(notification.user.user_id)
      break
    default:
      break
  }
}
