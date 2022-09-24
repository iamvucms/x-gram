import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { memo } from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { screenHeight, screenWidth } from '@/Theme'
interface DraggableProps {
  children: React.ReactNode
  minX?: number
  minY?: number
  maxX?: number
  maxY?: number
  style?: StyleProp<ViewStyle>
  snapTo?: 'horizontal' | 'vertical'
  spring?: boolean
}
const Draggable = ({
  children,
  minX = 0,
  maxX = screenWidth,
  maxY = screenHeight,
  minY = 0,
  snapTo,
  spring = true,
  style,
}: DraggableProps) => {
  const posX = useSharedValue(0)
  const posY = useSharedValue(0)
  const isSnapToHorizontal = snapTo === 'horizontal'
  const isSnapToVertical = snapTo === 'vertical'
  const animateTo = spring ? withSpring : withTiming
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.preX = posX.value
      ctx.preY = posY.value
    },
    onActive: (event, ctx: any) => {
      posX.value = ctx.preX + event.translationX
      posY.value = ctx.preY + event.translationY
    },
    onEnd: (event, ctx: any) => {
      const nextX = ctx.preX + event.translationX
      const nextY = ctx.preY + event.translationY
      if (nextX < minX) {
        posX.value = animateTo(minX)
        ctx.preX = minX
      } else if (nextX > maxX) {
        posX.value = animateTo(maxX)
        ctx.preX = maxX
      } else {
        if (isSnapToHorizontal) {
          posX.value = animateTo(nextX > (maxX - minX) / 2 ? maxX : minX)
          ctx.preX = nextX > (maxX - minX) / 2 ? maxX : minX
        } else {
          posX.value = nextX
          ctx.preX = nextX
        }
      }
      if (nextY < minY) {
        posY.value = animateTo(minY)
        ctx.preY = minY
      } else if (nextY > maxY) {
        posY.value = animateTo(maxY)
        ctx.preY = maxY
      } else {
        if (isSnapToVertical) {
          posY.value = animateTo(nextY > (maxY - minY) / 2 ? maxY : minY)
          ctx.preY = nextY > (maxY - minY) / 2 ? maxY : minY
        } else {
          posY.value = nextY
          ctx.preY = nextY
        }
      }
    },
  })
  const positionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: posX.value }, { translateY: posY.value }],
  }))
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[positionStyle, style]}>{children}</Animated.View>
    </PanGestureHandler>
  )
}

export default memo(Draggable)
