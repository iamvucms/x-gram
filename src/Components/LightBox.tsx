import { CloseSvg } from '@/Assets/Svg'
import { Colors, Layout, XStyleSheet, screenHeight, screenWidth } from '@/Theme'
import { getHitSlop } from '@/Utils'
import React, { memo, useEffect } from 'react'
import {
  BackHandler,
  ImageRequireSource,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { Source } from 'react-native-fast-image'
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  FadeInRight,
  ZoomIn,
  interpolate,
  runOnJS,
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
  const rotate = useSharedValue(0)
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
      const ratio = Math.abs(event.x - screenWidth / 2) / (screenWidth / 2)
      const nextDeg =
        (event.x > screenWidth / 2
          ? event.translationY / 5
          : -event.translationY / 5) * ratio
      if (nextDeg > 90 || nextDeg < -90) {
        return
      }
      rotate.value = nextDeg
    },
    onEnd: event => {
      if (event.translationY > screenHeight / 3) {
        runOnJS(onClose)()
      } else {
        translateY.value = withTiming(0)
        rotate.value = withTiming(0)
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
      {
        rotateZ: `${interpolate(
          rotate.value,
          [-90, 90],
          [-90, 90],
          Extrapolate.CLAMP,
        )}deg`,
      },
      {
        scale: interpolate(
          translateY.value,
          [0, screenHeight],
          [1, 0],
          Extrapolate.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      translateY.value,
      [0, screenHeight],
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }))
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - translateY.value / screenHeight,
  }))
  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      animationType="none"
      transparent
    >
      <GestureHandlerRootView style={Layout.fill}>
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
                entering={ZoomIn}
                style={[Layout.fill, imageContainerStyle]}
              >
                <AppImage
                  blurHashEnabled={false}
                  containerStyle={Layout.fill}
                  resizeMode="contain"
                  source={source}
                />
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
      </GestureHandlerRootView>
    </Modal>
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
