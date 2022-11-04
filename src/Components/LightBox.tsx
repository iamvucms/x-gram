import { CloseSvg } from '@/Assets/Svg'
import { Colors, Layout, screenHeight, screenWidth, XStyleSheet } from '@/Theme'
import { getHitSlop } from '@/Utils'
import { Portal } from '@gorhom/portal'
import React, { memo, useEffect, useRef } from 'react'
import { BackHandler, ImageRequireSource, TouchableOpacity } from 'react-native'
import { Source } from 'react-native-fast-image'
import {
  PanGestureHandler,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import Animated, {
  FadeInRight,
  runOnJS,
  SlideInDown,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import AppImage from './AppImage'
interface LightBoxProps {
  visible: boolean
  onRequestClose: () => void
  source: Source | ImageRequireSource
}
const LightBox = ({ visible, source, onRequestClose }: LightBoxProps) => {
  const scale = useSharedValue(1)
  const focalX = useSharedValue(0)
  const focalY = useSharedValue(0)
  const translateY = useSharedValue(0)
  const panRef = useRef()
  const onClose = () => {
    translateY.value = withTiming(screenHeight, {}, isFinished => {
      if (isFinished) {
        runOnJS(onRequestClose)()
        translateY.value = withDelay(200, withTiming(0, { duration: 0 }))
      }
    })
  }
  useEffect(() => {
    const handler = () => {
      onClose()
      return true
    }
    BackHandler.addEventListener('hardwareBackPress', handler)
    return () => BackHandler.removeEventListener('hardwareBackPress', handler)
  }, [])
  const pinchHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: event => {
        if (event.scale < 1) {
          return
        }
        scale.value = event.scale
        focalX.value = event.focalX - screenWidth / 2
        focalY.value = event.focalY - screenHeight / 2
      },
      onEnd: () => {
        scale.value = withTiming(1)
        focalX.value = withTiming(0)
        focalY.value = withTiming(0)
      },
    })
  const panHandler = useAnimatedGestureHandler({
    onActive: event => {
      translateY.value = event.translationY
    },
    onEnd: event => {
      if (event.translationY > screenHeight / 3) {
        runOnJS(onClose)()
      } else {
        translateY.value = withTiming(0)
      }
    },
  })

  const imageContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: focalX.value },
      { translateY: focalY.value },
      { scale: scale.value },
      { translateX: -focalX.value },
      { translateY: -focalY.value },
      {
        translateY: translateY.value,
      },
    ],
  }))
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - translateY.value / screenHeight,
  }))
  if (!visible) return null
  return (
    <Portal name="LIGHT_BOX">
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={styles.container}>
          <Animated.View entering={FadeInRight} style={styles.closeBtn}>
            <TouchableOpacity hitSlop={getHitSlop(20)} onPress={onClose}>
              <CloseSvg size={30} color={Colors.white} />
            </TouchableOpacity>
          </Animated.View>
          <PanGestureHandler maxPointers={1} onGestureEvent={panHandler}>
            <Animated.View
              entering={SlideInDown}
              style={[Layout.fill, imageContainerStyle]}
            >
              <AppImage
                containerStyle={Layout.fill}
                resizeMode="contain"
                source={source}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </Portal>
  )
}

export default memo(LightBox)

const styles = XStyleSheet.create({
  container: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  backdrop: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: Colors.black,
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 3,
  },
})
