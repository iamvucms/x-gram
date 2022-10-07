import {
  BookMarkSvg,
  CommentSvg,
  HeartSvg,
  SendSvg,
  StoryGradientBorderSvg,
} from '@/Assets/Svg'
import {
  Colors,
  ResponsiveHeight,
  ResponsiveWidth,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { BlurView } from '@react-native-community/blur'
import { useLocalObservable } from 'mobx-react-lite'
import React, { memo, useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Animated, {
  FadeIn,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Obx } from '.'
import AppImage from './AppImage'
import AppText from './AppText'
import Box from './Box'
import Padding from './Padding'
const PostItem = () => {
  const pageAnim = useSharedValue(0)
  const state = useLocalObservable(() => ({
    imageIndex: 0,
    setImageIndex: (index: number) => (state.imageIndex = index),
  }))
  const images = [
    'https://picsum.photos/1000/1000',
    'https://picsum.photos/900/900',
    'https://picsum.photos/800/800',
    'https://picsum.photos/700/700',
  ]

  const onImagePress = useCallback(() => {
    if (state.imageIndex < images.length - 1) {
      state.setImageIndex(state.imageIndex + 1)
      pageAnim.value = withSpring(state.imageIndex)
    } else {
      state.setImageIndex(0)
      pageAnim.value = withSpring(0)
    }
  }, [])

  const renderIndicatorItem = useCallback((_, index) => {
    return <IndicatorItem pageAnim={pageAnim} key={index} index={index} />
  }, [])
  return (
    <View style={styles.rootView}>
      <Obx>
        {() => (
          <AppImage
            onPress={onImagePress}
            source={{
              uri: images[state.imageIndex],
            }}
            containerStyle={styles.imageContainer}
          />
        )}
      </Obx>
      <View style={styles.indicatorView}>
        {images.map(renderIndicatorItem)}
      </View>
      <Box padding={16} row align="center" justify="space-between">
        <Box row align="center">
          <View style={styles.avatarView}>
            <StoryGradientBorderSvg size={66} />
            <AppImage
              containerStyle={styles.avatarImg}
              source={{
                uri: 'https://picsum.photos/500/500',
              }}
            />
          </View>
          <Padding left={16} />
          <View>
            <AppText
              color={Colors.white}
              fontSize={16}
              lineHeight={23}
              fontWeight={400}
            >
              Eric Ray
            </AppText>
            <Padding top={3} />
            <AppText fontSize={12} color={Colors.white75}>
              1 hour ago
            </AppText>
          </View>
        </Box>
        <TouchableOpacity style={styles.bookMarkBtn}>
          <BookMarkSvg color={Colors.white} />
        </TouchableOpacity>
      </Box>
      <View style={styles.sideBarView}>
        <TouchableOpacity style={styles.sideBarBtn}>
          <SendSvg color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBarBtn}>
          <CommentSvg color={Colors.white} />
          <Padding top={4} />
          <AppText fontWeight={700} color={Colors.white}>
            2.5k
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sideBarBtn, styles.reactBtn]}>
          <HeartSvg color={Colors.white} />
          <Padding top={4} />
          <AppText fontWeight={700} color={Colors.white}>
            2.9k
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PostItem
interface IndicatorItemProps {
  index: number
  pageAnim: SharedValue<number>
}
const IndicatorItem = memo(({ index, pageAnim }: IndicatorItemProps) => {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      pageAnim.value,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5],
      Animated.Extrapolate.CLAMP,
    ),
    width: interpolate(
      pageAnim.value,
      [index - 1, index, index + 1],
      [8, 24, 8],
      Animated.Extrapolate.CLAMP,
    ),
  }))
  return <Animated.View style={[styles.indicator, style]} />
})
const styles = XStyleSheet.create({
  rootView: {
    width: screenWidth - ResponsiveWidth(32),
    minHeight: screenWidth - ResponsiveWidth(32),
    marginHorizontal: ResponsiveWidth(16),
    skipResponsive: true,
    marginTop: ResponsiveHeight(16),
  },
  imageContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    aspectRatio: 1,
    height: undefined,
    zIndex: -1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatarView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    height: 54,
    width: 54,
    borderRadius: 24,
    position: 'absolute',
    zIndex: 10,
    overflow: 'hidden',
  },
  bookMarkBtn: {
    height: 57,
    width: 57,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white50,
    borderRadius: 99,
  },
  sideBarView: {
    position: 'absolute',
    zIndex: 10,
    right: 16,
    bottom: 16,
    width: 57,
    alignItems: 'center',
  },
  sideBarBtn: {
    height: 57,
    width: 57,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  reactBtn: {
    backgroundColor: Colors.white50,
    height: 80,
    borderRadius: 99,
  },
  indicatorView: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    backgroundColor: Colors.white,
    height: 6,
    marginHorizontal: 4,
    borderRadius: 10,
  },
})
