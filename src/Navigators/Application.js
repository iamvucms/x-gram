import { PageName } from '@/Config'
import { useAppTheme } from '@/Hooks'
import {
  AuthPassCodeScreen,
  CaptureScreen,
  ConversationDetailScreen,
  ConversationsScreen,
  ConverstionInforScreen,
  CreateConversationScreen,
  CreatePost,
  EditProfileScreen,
  ImageEditor,
  InAppUpdateScreen,
  LoginScreen,
  MediaPicker,
  OnboardingScreen,
  PersonalInformationScreen,
  PostDetailScreen,
  ProfileOther,
  RecoveryPasswordScreen,
  RegisterScreen,
  SettingScreen,
  StoryScreen,
  UserPostsScreen,
  CreateFeatureScreen,
  EditPostScreen,
  FollowScreen,
} from '@/Screens'
import { Colors } from '@/Theme'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { forwardRef } from 'react'
import BottomTab from './BottomTab'
import { navigationRef, screenOptions } from './NavigationUtils'
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
      <Stack.Screen name={PageName.MediaPicker} component={MediaPicker} />
      <Stack.Screen name={PageName.ImageEditor} component={ImageEditor} />
      <Stack.Screen name={PageName.CaptureScreen} component={CaptureScreen} />
      <Stack.Screen
        options={{
          animation: 'slide_from_bottom',
        }}
        name={PageName.StoryScreen}
        component={StoryScreen}
      />
      <Stack.Screen
        name={PageName.PostDetailScreen}
        component={PostDetailScreen}
      />
      <Stack.Screen
        name={PageName.UserPostsScreen}
        component={UserPostsScreen}
      />
      <Stack.Screen
        name={PageName.ConversationsScreen}
        component={ConversationsScreen}
      />
      <Stack.Screen
        name={PageName.ConversationDetailScreen}
        component={ConversationDetailScreen}
      />
      <Stack.Screen
        name={PageName.ConverstionInforScreen}
        component={ConverstionInforScreen}
      />
      <Stack.Screen
        name={PageName.CreateConversationScreen}
        component={CreateConversationScreen}
      />
      <Stack.Screen name={PageName.SettingScreen} component={SettingScreen} />
      <Stack.Screen name={PageName.CreatePost} component={CreatePost} />
      <Stack.Screen
        name={PageName.CreateFeatureScreen}
        component={CreateFeatureScreen}
      />
      <Stack.Screen
        options={{
          animation: 'slide_from_bottom',
        }}
        name={PageName.EditPostScreen}
        component={EditPostScreen}
      />
      <Stack.Screen name={PageName.FollowScreen} component={FollowScreen} />
    </Stack.Navigator>
  )
}
export const EditProfileNavigator = forwardRef(({}, ref) => {
  return (
    <NavigationContainer ref={ref}>
      <Stack.Navigator
        screenOptions={{
          ...screenOptions,
          contentStyle: {
            backgroundColor: Colors.transparent,
          },
        }}
      >
        <Stack.Screen
          name={PageName.EditProfileScreen}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name={PageName.PersonalInformationScreen}
          component={PersonalInformationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
})
