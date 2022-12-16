import { Colors, ResponsiveWidth, XStyleSheet } from '@/Theme'
import React from 'react'
import { Pressable } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated'
interface AppSwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  indicatorColor?: string
  backgroundColor?: string
}
const maxX = ResponsiveWidth(24)
const AppSwitch = ({
  value,
  onValueChange,
  indicatorColor = Colors.white,
}: AppSwitchProps) => {
  const anim = useDerivedValue(() => withTiming(value ? 1 : 0), [value])
  const containerStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        anim.value,
        [0, 1],
        [Colors.border, Colors.primary],
      ),
    }),
    [],
  )
  const indicatorStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: anim.value * maxX,
        },
      ],
    }),
    [],
  )
  return (
    <Pressable onPress={() => onValueChange && onValueChange(!value)}>
      <Animated.View style={[styles.rootView, containerStyle]}>
        <Animated.View
          style={[
            styles.indicatorView,
            indicatorStyle,
            { backgroundColor: indicatorColor },
          ]}
        />
      </Animated.View>
    </Pressable>
  )
}

export default AppSwitch

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.border,
    width: 54,
    height: 30,
    borderRadius: 99,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  indicatorView: {
    height: 24,
    width: 24,
    borderRadius: 99,
    backgroundColor: Colors.white,
  },
})
