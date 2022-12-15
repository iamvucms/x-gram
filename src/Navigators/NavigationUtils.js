import { PageName } from '@/Config'
import { chatStore, profileStore, userStore } from '@/Stores'
import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()

export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params)
  }
}

export const navigatePush = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params))
  }
}

export const navigateAndReset = (routes = [], index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: routes.map(route => ({ name: route })),
      }),
    )
  }
}

export const navigateAndSimpleReset = (name, index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{ name }],
      }),
    )
  }
}

export function navigateReplace(name, param) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      StackActions.replace(name, {
        param,
      }),
    )
  }
}

export const goBack = () => {
  navigationRef.goBack()
}

export const screenOptions = {
  headerShown: false, // default header is making screen flicker on android
  statusBarAnimation: 'slide',
  animation: 'slide_from_right',
}

export const navigateToProfile = userId => {
  if (userId === userStore.userInfo.user_id) {
    navigate(PageName.ProfileScreen)
  } else {
    // get profile data from server
    profileStore.fetchProfile(userId)
    profileStore.fetchPosts(false)
    navigate(PageName.ProfileOther, { userId })
  }
}
export const navigateToConversationDetail = user => {
  const conversation = chatStore.getConversationByUserId(user.user_id)
  if (!conversation) {
    chatStore.fetchMessages(conversation.conversation_id)
    navigate(PageName.ConversationDetailScreen)
  } else {
    navigate(PageName.CreateConversationScreen, {
      user,
    })
  }
}
