import {
  Colors,
  Layout,
  moderateScale,
  ResponsiveWidth,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import React, { memo, useCallback, useRef } from 'react'
import { Pressable, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import Animated, { FadeIn } from 'react-native-reanimated'
interface PostGridItemProps {
  post: any
  enablePreview?: boolean
  onOpenPreview?: (args: any) => void
  onClosePreview?: () => void
  onPress?: (args: any) => void
}
const PostGridItem = ({
  post,
  enablePreview,
  onOpenPreview,
  onClosePreview,
  onPress,
}: PostGridItemProps) => {
  const ref = useRef<View>()
  const showing = useRef(false)
  const onLongPress = useCallback(() => {
    if (enablePreview) {
      showing.current = true
      ref?.current?.measure((x, y, width, height, pageX, pageY) => {
        onOpenPreview?.({
          x: pageX,
          y: pageY,
          width,
          height,
        })
      })
    }
  }, [enablePreview, post])

  const _onClosePreview = useCallback(() => {
    if (showing.current) {
      showing.current = false
      onClosePreview?.()
    }
  }, [onClosePreview])
  console.log(post)
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressOut={_onClosePreview}
      style={styles.rootView}
    >
      <Animated.View style={Layout.fill} entering={FadeIn}>
        <FastImage
          source={{
            uri: post?.medias?.[0]?.url,
          }}
          style={Layout.fill}
        />
      </Animated.View>
    </Pressable>
  )
}

export default memo(PostGridItem)

const styles = XStyleSheet.create({
  rootView: {
    skipResponsive: true,
    width: (screenWidth - ResponsiveWidth(40)) / 3,
    aspectRatio: 1,
    height: undefined,
    marginLeft: ResponsiveWidth(10),
    marginBottom: ResponsiveWidth(10),
    backgroundColor: Colors.gray,
    borderRadius: moderateScale(6),
    overflow: 'hidden',
  },
})
