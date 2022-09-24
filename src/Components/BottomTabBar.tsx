import { BarsSvg, HomeSvg } from '@/Assets/Svg'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useCallback, useMemo } from 'react'
import { Pressable, View } from 'react-native'
import AppText from './AppText'
import Padding from './Padding'

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
        name: 'Menu',
        icon: BarsSvg,
        routeName: PageName.MenuStack,
        active: state.index === 1,
      },
    ],
    [state.index],
  )
  const renderTabItem = useCallback(tab => {
    return (
      <Pressable
        key={tab.name}
        style={[Layout.fill, Layout.center]}
        onPress={() => navigate(tab.routeName)}
      >
        <tab.icon
          size={24}
          color={tab.active ? Colors.primary : Colors.white}
        />
        <Padding top={5} />
        <AppText color={tab.active ? Colors.primary : Colors.white}>
          {tab.name}
        </AppText>
      </Pressable>
    )
  }, [])
  return <View style={styles.tabBarView}>{tabBars.map(renderTabItem)}</View>
}

export default BottomTabBar

const styles = XStyleSheet.create({
  tabBarView: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})
