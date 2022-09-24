import { XStyleSheet } from '@/Theme'
import React, { memo } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
interface PositionProps {
  top?: number
  bottom?: number
  left?: number
  right?: number
  zIndex?: number
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}
const Position = ({
  children,
  style,
  top,
  bottom,
  left,
  right,
  zIndex,
  ...restProps
}: PositionProps) => {
  const styles = XStyleSheet.create({
    container: {
      top,
      bottom,
      left,
      right,
      zIndex,
      position: 'absolute',
    },
  })

  return (
    <View {...restProps} style={[style, styles.container]}>
      {children}
    </View>
  )
}

export default memo(Position)
