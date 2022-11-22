import { XStyleSheet } from '@/Theme'
import { useLocalObservable } from 'mobx-react-lite'
import React, { Fragment, memo, useEffect, useRef } from 'react'
import {
  ImageRequireSource,
  Modal,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { Blurhash } from 'react-native-blurhash'
import FastImage, { FastImageProps, Source } from 'react-native-fast-image'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { LightBox, Obx } from '.'
interface AppImageProps {
  source: Source | ImageRequireSource
  style?: FastImageProps['style']
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'
  blurHashEnabled?: boolean
  containerStyle?: StyleProp<ViewStyle>
  disabled?: boolean
  enablePinchZoom?: boolean
  onPress?: () => void
  lightbox?: boolean
}
const AppImage = ({
  source,
  blurHashEnabled = false,
  enablePinchZoom = false,
  resizeMode = 'cover',
  style,
  containerStyle,
  disabled,
  onPress,
  lightbox,
}: AppImageProps) => {
  const pinchRef = useRef()
  const panRef = useRef()
  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const fadingAnim = useSharedValue(1)
  const state = useLocalObservable(() => ({
    hash: 'L9AB*A%LPqys8_H=yDR5nMMeVXR5',
    lightboxVisible: false,
    setHash: payload => (state.hash = payload),
    setLightboxVisible: payload => (state.lightboxVisible = payload),
  }))

  useEffect(() => {
    if (source['uri'] && blurHashEnabled) {
      Blurhash.encode(source['uri'], 4, 3).then(hash => {
        state.setHash(hash)
      })
    }
  }, [source])

  const blurStyle = useAnimatedStyle(() => ({
    opacity: fadingAnim.value,
  }))

  const panGestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onActive: event => {
        translateX.value = event.translationX
        translateY.value = event.translationY
      },
      onEnd: () => {
        translateX.value = withTiming(0)
        translateY.value = withTiming(0)
      },
    })

  const pinchGestureHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: event => {
        if (event.scale > 1) {
          scale.value = event.scale
        }
      },
      onEnd: () => {
        scale.value = withTiming(1)
      },
    })
  const imageContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
      {
        translateX: -translateX.value,
      },
      {
        translateY: -translateY.value,
      },
    ],
  }))
  return (
    <Fragment>
      <Pressable
        disabled={disabled}
        onPress={lightbox ? () => state.setLightboxVisible(true) : onPress}
        style={[styles.baseContainer, containerStyle]}
      >
        {blurHashEnabled && (
          <Animated.View style={[styles.blurhashView, blurStyle]}>
            <Obx>
              {() => (
                <Blurhash
                  style={styles.blurhashView}
                  blurhash={state.hash}
                  resizeMode="cover"
                />
              )}
            </Obx>
          </Animated.View>
        )}
        <PanGestureHandler
          enabled={enablePinchZoom}
          minPointers={2}
          onGestureEvent={panGestureHandler}
          ref={panRef}
          simultaneousHandlers={pinchRef}
        >
          <Animated.View>
            <PinchGestureHandler
              enabled={enablePinchZoom}
              ref={pinchRef}
              simultaneousHandlers={panRef}
              onGestureEvent={pinchGestureHandler}
            >
              <Animated.View style={imageContainerStyle}>
                <FastImage
                  onLoadEnd={() => {
                    fadingAnim.value = withTiming(0)
                  }}
                  style={[styles.image, style]}
                  resizeMode={resizeMode}
                  source={source}
                />
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </Pressable>
      {lightbox && (
        <Obx>
          {() => (
            <LightBox
              visible={state.lightboxVisible}
              onRequestClose={() => state.setLightboxVisible(false)}
              source={source}
            />
          )}
        </Obx>
      )}
    </Fragment>
  )
}

export default memo(AppImage)

const styles = XStyleSheet.create({
  blurhashView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  baseContainer: {},
})
