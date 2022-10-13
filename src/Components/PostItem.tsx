import {
  BookMarkSvg,
  CommentSvg,
  HeartSvg,
  SendSvg,
  StoryGradientBorderSvg,
} from '@/Assets/Svg'
import { PageName } from '@/Config'
import { navigate, navigateToProfile } from '@/Navigators'
import {
  Colors,
  moderateScale,
  ResponsiveHeight,
  ResponsiveWidth,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { formatAmount } from '@/Utils'
import { useLocalObservable } from 'mobx-react-lite'
import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Expanded, Obx } from '.'
import AppImage from './AppImage'
import AppText from './AppText'
import Box from './Box'
import Padding from './Padding'
interface PostItemProps {
  onCommentPress?: () => void
  onSharePress?: () => void
  post: any
}
const PostItem = ({ post, onCommentPress, onSharePress }: PostItemProps) => {
  const pageAnim = useSharedValue(0)
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    imageIndex: 0,
    setImageIndex: (index: number) => (state.imageIndex = index),
  }))

  const onImagePress = useCallback(() => {
    if (state.imageIndex < post.medias.length - 1) {
      state.setImageIndex(state.imageIndex + 1)
      pageAnim.value = withTiming(state.imageIndex)
    } else {
      state.setImageIndex(0)
      pageAnim.value = withTiming(0)
    }
  }, [])

  const renderIndicatorItem = useCallback((_, index) => {
    return <IndicatorItem pageAnim={pageAnim} key={index} index={index} />
  }, [])
  const onMentionPress = useCallback(user_id => {
    navigateToProfile(user_id)
  }, [])
  return (
    <Box marginHorizontal={16} marginTop={16}>
      <View style={styles.rootView}>
        <Obx>
          {() => (
            <AppImage
              enablePinchZoom
              onPress={onImagePress}
              source={{
                uri: post.medias[state.imageIndex].url,
              }}
              containerStyle={styles.imageContainer}
            />
          )}
        </Obx>
        {post.medias.length > 1 && (
          <View style={styles.indicatorView}>
            {post.medias.map(renderIndicatorItem)}
          </View>
        )}
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
          <TouchableOpacity onPress={onSharePress} style={styles.sideBarBtn}>
            <SendSvg color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onCommentPress} style={styles.sideBarBtn}>
            <CommentSvg color={Colors.white} />
            <Padding top={4} />
            <Obx>
              {() => (
                <AppText fontWeight={700} color={Colors.white}>
                  {formatAmount(post.comments.length)}
                </AppText>
              )}
            </Obx>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sideBarBtn, styles.reactBtn]}>
            <HeartSvg color={Colors.white} />
            <Padding top={4} />
            <Obx>
              {() => (
                <AppText fontWeight={700} color={Colors.white}>
                  {formatAmount(post.reactions.length)}
                </AppText>
              )}
            </Obx>
          </TouchableOpacity>
        </View>
      </View>
      <Box marginTop={14}>
        <AppText lineHeight={18}>
          <AppText lineHeight={18} fontWeight={700}>
            {post.posted_by.user_id}
          </AppText>{' '}
          {post.message}
        </AppText>
        <Padding top={8} />
        {post.comments.length > 0 &&
          post.comments.slice(-2).map(comment => (
            <AppText
              key={comment.comment_id}
              regexMetion
              onMentionPress={onMentionPress}
              numberOfLines={1}
              lineHeight={18}
            >
              <AppText numberOfLines={1} lineHeight={18} fontWeight={700}>
                {comment.commented_by.user_id}
              </AppText>{' '}
              {comment.comment}
            </AppText>
          ))}
      </Box>
      <TouchableOpacity onPress={onCommentPress} style={styles.commentBar}>
        <AppImage
          source={{
            uri: 'https://picsum.photos/500/500',
          }}
          containerStyle={styles.profileImg}
        />
        <AppText>{t('home.comment_placeholder')}</AppText>
        <Expanded />
        <Obx>
          {() => (
            <AppText fontWeight={700}>
              ({formatAmount(post.comments.length)} Comments)
            </AppText>
          )}
        </Obx>
      </TouchableOpacity>
    </Box>
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
    skipResponsive: true,
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
    backgroundColor: Colors.background,
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
  profileImg: {
    height: 27,
    width: 27,
    borderRadius: 11,
    overflow: 'hidden',
    marginRight: 16,
  },
  commentBar: {
    height: ResponsiveHeight(50),
    width: screenWidth - ResponsiveWidth(32),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ResponsiveWidth(16),
    backgroundColor: Colors.kF8F8F8,
    marginTop: ResponsiveHeight(14),
    borderRadius: moderateScale(16),
    skipResponsive: true,
  },
})
