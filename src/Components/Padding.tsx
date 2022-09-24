import { StyleProp, View, ViewProps } from 'react-native'
import React, { memo } from 'react'
import { moderateScale, ResponsiveHeight, ResponsiveWidth } from '@/Theme'
interface PaddingProps {
  bottom?: number
  left?: number
  right?: number
  top?: number
  padding?: number
  horizontal?: number
  vertical?: number
  style?: StyleProp<ViewProps>
  children?: React.ReactNode
}
const Padding = ({
  bottom = 0,
  left = 0,
  right = 0,
  top = 0,
  padding = 0,
  horizontal = 0,
  vertical = 0,
  children,
  style,
  ...restProps
}: PaddingProps) => {
  return (
    <View
      {...restProps}
      style={[
        style,
        {
          ...(bottom && {
            paddingBottom: ResponsiveHeight(bottom),
          }),
          ...(left && { paddingLeft: ResponsiveWidth(left) }),
          ...(right && { paddingRight: ResponsiveWidth(right) }),
          ...(top && { paddingTop: ResponsiveHeight(top) }),
          ...(padding && { padding: moderateScale(padding) }),
          ...(horizontal && {
            paddingHorizontal: ResponsiveWidth(horizontal),
          }),
          ...(vertical && {
            paddingVertical: ResponsiveHeight(vertical),
          }),
        },
      ]}
    >
      {children}
    </View>
  )
}

export default memo(Padding)
