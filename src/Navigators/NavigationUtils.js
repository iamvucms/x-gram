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
}
