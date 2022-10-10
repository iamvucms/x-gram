import { HeartSvg, HomeSvg, PlusCircleSvg, SearchSvg } from '@/Assets/Svg'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useCallback, useMemo } from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'

const BottomTabBar = ({ state }: BottomTabBarProps) => {
  const tabBars = useMemo(
    () => [
      {
        name: 'Home',
        icon: HomeSvg,
        routeName: PageName.HomeStack,
        active: state.index === 0,
      },
      {
        name: 'Search',
        icon: SearchSvg,
        routeName: PageName.SearchScreen,
        active: state.index === 1,
      },
      {
        name: 'Create',
        icon: PlusCircleSvg,
      },
      {
        name: 'Notification',
        icon: HeartSvg,
        routeName: PageName.NotificationScreen,
        active: state.index === 2,
      },
      {
        name: 'Profile',
        icon: HomeSvg,
        routeName: PageName.ProfileScreen,
        active: state.index === 3,
      },
    ],
    [state.index],
  )
  const renderTabItem = useCallback(tab => {
    return (
      <React.Fragment key={tab.name}>
        {tab.name !== 'Create' ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[Layout.fill, Layout.center]}
            onPress={() => navigate(tab.routeName)}
          >
            <tab.icon
              size={24}
              color={tab.active ? Colors.secondary : Colors.kC2C2C2}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.8} style={styles.createBtn}>
            <tab.icon size={75} />
          </TouchableOpacity>
        )}
      </React.Fragment>
    )
  }, [])
  return (
    <View style={styles.rootView}>
      <View style={styles.tabBarView}>{tabBars.map(renderTabItem)}</View>
    </View>
  )
}

export default BottomTabBar

const styles = XStyleSheet.create({
  rootView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white95,
    zIndex: 99,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabBarView: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  createBtn: {
    marginBottom: 50,
  },
})
