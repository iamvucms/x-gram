import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import React, { memo } from 'react'
import { Layout } from '@/Theme'
interface ExpandedProps extends ViewProps {
  children?: React.ReactNode
}
const Expanded = ({ children, style, ...restProps }: ExpandedProps) => {
  return (
    <View {...restProps} style={[Layout.fill, style]}>
      {children}
    </View>
  )
}

export default memo(Expanded)
