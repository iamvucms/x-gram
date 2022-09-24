import { XStyleSheet } from '@/Theme'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import {
  ImageRequireSource,
  ImageURISource,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { Blurhash } from 'react-native-blurhash'
import FastImage, { FastImageProps } from 'react-native-fast-image'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Obx } from '.'
interface AppImageProps {
  source: ImageURISource & ImageRequireSource
  style?: FastImageProps['style']
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'
  blurHashEnabled?: boolean
  containerStyle: StyleProp<ViewStyle>
  disabled?: boolean
  onPress?: () => void
}
const AppImage = ({
  source,
  blurHashEnabled = true,
  resizeMode = 'cover',
  style,
  containerStyle,
  disabled,
  onPress,
}: AppImageProps) => {
  const fadingAnim = useSharedValue(1)
  const state = useLocalObservable(() => ({
    hash: 'L9AB*A%LPqys8_H=yDR5nMMeVXR5',
    setHash: payload => (state.hash = payload),
  }))

  useEffect(() => {
    if (source.uri) {
      Blurhash.encode(source.uri, 4, 3).then(hash => {
        state.setHash(hash)
      })
    }
  }, [source])
  const blurStyle = useAnimatedStyle(() => ({
    opacity: fadingAnim.value,
  }))
  return (
    <Pressable disabled={disabled} onPress={onPress} style={containerStyle}>
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
      <FastImage
        onLoadEnd={() => {
          fadingAnim.value = withTiming(0)
        }}
        style={style}
        resizeMode={resizeMode}
        source={source}
      />
    </Pressable>
  )
}

export default AppImage

const styles = XStyleSheet.create({
  blurhashView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 10,
  },
})
