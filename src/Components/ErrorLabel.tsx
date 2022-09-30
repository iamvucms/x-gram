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
      style={[{ paddingTop: ResponsiveHeight(10) }, containerStyle]}
      entering={FadeIn}
    >
      <AppText color={Colors.error} style={textStyle}>
        {text}
      </AppText>
    </Animated.View>
  )
}

export default ErrorLabel
