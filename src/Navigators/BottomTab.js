import { BottomTabBar } from '@/Components'
import { PageName } from '@/Config'
import {
  HomeScreen,
  NotificationScreen,
  ProfileScreen,
  SearchScreen,
} from '@/Screens'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { screenOptions } from './NavigationUtils'
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
const BottomTab = () => {
  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={screenOptions}
    >
      <Tab.Screen name={PageName.HomeStack} component={HomeStack} />
      <Tab.Screen name={PageName.SearchScreen} component={SearchScreen} />
      <Tab.Screen
        name={PageName.NotificationScreen}
        component={NotificationScreen}
      />
      <Tab.Screen name={PageName.ProfileScreen} component={ProfileScreen} />
    </Tab.Navigator>
  )
}
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={PageName.HomeScreen} component={HomeScreen} />
    </Stack.Navigator>
  )
}

export default BottomTab
