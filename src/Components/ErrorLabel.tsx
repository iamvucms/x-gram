import { Colors, ResponsiveHeight } from '@/Theme'
import React from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import AppText from './AppText'
interface ErrorLabelProps {
  text: string
  containerStyle?: ViewStyle
  textStyle?: TextStyle
}
const ErrorLabel = ({ text, containerStyle, textStyle }: ErrorLabelProps) => {
  return (
    <Animated.View
      style={[{ paddingTop: ResponsiveHeight(6) }, containerStyle]}
      entering={FadeIn}
    >
      <AppText fontSize={12} color={Colors.error} style={textStyle}>
        {text}
      </AppText>
    </Animated.View>
  )
}

export default ErrorLabel
