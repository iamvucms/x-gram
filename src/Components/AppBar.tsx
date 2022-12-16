import { ChevronRightSvg } from '@/Assets/Svg'
import { goBack } from '@/Navigators'
import { Colors, screenWidth, XStyleSheet } from '@/Theme'
import { getHitSlop } from '@/Utils'
import React, { memo } from 'react'
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'
import AppText from './AppText'
interface AppBarProps {
  title: string
  titleColor?: string
  showBack?: boolean
  onBackPress?: () => void
  onRightPress?: () => void
  leftIcon?: React.ReactNode
  rightComponent?: React.ReactNode
  headerStyle: StyleProp<ViewStyle>
}
const AppBar = ({
  title,
  titleColor = Colors.black,
  showBack = true,
  onBackPress = () => goBack(),
  leftIcon,
  onRightPress,
  rightComponent,
  headerStyle,
}: AppBarProps) => {
  return (
    <View style={[styles.header, headerStyle]}>
      {showBack && (
        <TouchableOpacity
          hitSlop={getHitSlop(10)}
          onPress={onBackPress}
          style={styles.backBtn}
        >
          {leftIcon || <ChevronRightSvg />}
        </TouchableOpacity>
      )}
      <AppText color={titleColor} fontWeight={700} fontSize={18}>
        {title}
      </AppText>
      {!!rightComponent && (
        <TouchableOpacity
          hitSlop={getHitSlop(10)}
          onPress={onRightPress}
          style={styles.rightComponent}
        >
          {rightComponent}
        </TouchableOpacity>
      )}
    </View>
  )
}

export default memo(AppBar)

const styles = XStyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.6,
  },
  backBtn: {
    position: 'absolute',
    height: 44,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    zIndex: 1,
    transform: [{ rotate: '180deg' }],
  },
  rightComponent: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
})
