import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef, screenOptions } from './NavigationUtils'
import { useAppTheme } from '@/Hooks'
import { PageName } from '@/Config'
import BottomTab from './BottomTab'
import {
  AuthPassCodeScreen,
  InAppUpdateScreen,
  LoginScreen,
  OnboardingScreen,
  ProfileOther,
  RecoveryPasswordScreen,
  RegisterScreen,
} from '@/Screens'
const Stack = createNativeStackNavigator()
const Application = () => {
  const { NavigationTheme } = useAppTheme()
  return (
    <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={PageName.OnboardingScreen}
        screenOptions={screenOptions}
      >
        <Stack.Screen
          name={PageName.OnboardingScreen}
          component={OnboardingScreen}
        />
        <Stack.Screen
          name={PageName.InAppUpdateScreen}
          component={InAppUpdateScreen}
        />
        <Stack.Screen name={PageName.PreAuthStack} component={PreAuthStack} />
        <Stack.Screen name={PageName.AuthStack} component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default Application

const PreAuthStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={PageName.LoginScreen} component={LoginScreen} />
      <Stack.Screen name={PageName.RegisterScreen} component={RegisterScreen} />
      <Stack.Screen
        name={PageName.AuthPassCodeScreen}
        component={AuthPassCodeScreen}
      />
      <Stack.Screen
        name={PageName.RecoveryPasswordScreen}
        component={RecoveryPasswordScreen}
      />
    </Stack.Navigator>
  )
}

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={PageName.HomeTab} component={BottomTab} />
      <Stack.Screen name={PageName.ProfileOther} component={ProfileOther} />
    </Stack.Navigator>
  )
}
