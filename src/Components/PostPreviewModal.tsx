import { StoryGradientBorderSvg } from '@/Assets/Svg'
import { Colors, screenHeight, screenWidth, XStyleSheet } from '@/Theme'
import { Portal } from '@gorhom/portal'
import { BlurView } from '@react-native-community/blur'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'
import Animated, {
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Obx } from '.'
import AppImage from './AppImage'
import AppText from './AppText'
import Box from './Box'
import Padding from './Padding'
import Position from './Position'
interface PostPreviewModalProps {
  x: number
  y: number
  width: number
  height: number
  post: any
  visible: boolean
}
const size = screenWidth * 0.9
const PostPreviewModal = ({
  x = 0,
  y = 0,
  height = 0,
  width = 0,
  post,
  visible,
}: PostPreviewModalProps) => {
  const state = useLocalObservable(() => ({
    modalVisible: visible,
    setModalVisible: (value: boolean) => (state.modalVisible = value),
  }))
  const anim = useSharedValue(0)
  useEffect(() => {
    if (visible) {
      state.setModalVisible(true)
      anim.value = withTiming(1)
    } else {
      const callback = () => {
        state.setModalVisible(false)
      }
      anim.value = withTiming(
        0,
        {},
        isFinished => isFinished && runOnJS(callback)(),
      )
    }
  }, [visible])
  const containerStyle = useAnimatedStyle(() => {
    if (!visible) {
      return {}
    }
    return {
      opacity: anim.value,
      top: interpolate(anim.value, [0, 1], [y, (screenHeight - size) / 2]),
      left: interpolate(anim.value, [0, 1], [x, (screenWidth - size) / 2]),
      width: interpolate(anim.value, [0, 1], [width, size]),
      height: interpolate(anim.value, [0, 1], [height, size]),
    }
  })
  const modalStyle = useAnimatedStyle(() => ({
    zIndex: anim.value > 0 ? 100 : -100,
    opacity: anim.value,
  }))
  return (
    <Obx>
      {() =>
        !state.modalVisible ? null : (
          <Portal name="POST_PREVIEW">
            <Animated.View style={[styles.modalView, modalStyle]}>
              <BlurView style={styles.blurView} />
              <Animated.View style={[styles.postView, containerStyle]}>
                <FastImage
                  style={styles.imageView}
                  source={{
                    uri: post?.medias?.[0]?.url,
                  }}
                />
                <Position left={16} right={16} top={16} zIndex={10}>
                  <Box row align="center">
                    <View style={styles.avatarView}>
                      <StoryGradientBorderSvg size={66} />
                      <AppImage
                        containerStyle={styles.avatarImg}
                        source={{
                          uri: post?.posted_by?.avatar_url,
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
                        {post?.posted_by?.user_id}
                      </AppText>
                      <Padding top={3} />
                      <AppText fontSize={12} color={Colors.white75}>
                        1 hour ago
                      </AppText>
                    </View>
                  </Box>
                </Position>
              </Animated.View>
            </Animated.View>
          </Portal>
        )
      }
    </Obx>
  )
}

export default PostPreviewModal

const styles = XStyleSheet.create({
  modalView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  postView: {
    position: 'absolute',
    zIndex: 99,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageView: {
    width: '100%',
    height: '100%',
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
})
