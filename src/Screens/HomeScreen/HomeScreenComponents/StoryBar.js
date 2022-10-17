import { CreateStorySvg, StoryGradientBorderSvg } from '@/Assets/Svg'
import { AppImage, AppText, Padding } from '@/Components'
import { PageName } from '@/Config'
import { mockStories } from '@/Models'
import { navigate } from '@/Navigators'
import { Colors, XStyleSheet } from '@/Theme'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  ZoomIn,
} from 'react-native-reanimated'
import { CreateType } from '@/Models'
const MAX_SCROLL_Y = 100

const StoryBar = ({ stories = mockStories, scrollY }) => {
  const { t } = useTranslation()

  const renderStoryItem = useCallback(({ item, index }) => {
    return <StoryItem story={item} index={index} scrollY={scrollY} />
  }, [])

  const containerStyle = useAnimatedStyle(() => ({
    borderBottomLeftRadius: interpolate(
      scrollY.value,
      [0, MAX_SCROLL_Y],
      [42, 0],
      Animated.Extrapolate.CLAMP,
    ),
    borderBottomRightRadius: interpolate(
      scrollY.value,
      [0, MAX_SCROLL_Y],
      [42, 0],
      Animated.Extrapolate.CLAMP,
    ),
  }))

  const createBtnStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollY.value,
          [0, MAX_SCROLL_Y],
          [1, 0],
          Animated.Extrapolate.CLAMP,
        ),
      },
    ],
  }))

  const createBtnTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, MAX_SCROLL_Y], [1, 0]),
  }))

  const CreateButton = useMemo(() => {
    const onCreatePress = () => {
      navigate(PageName.MediaPicker, {
        multiple: true,
        onNext: medias => {
          navigate(PageName.ImageEditor, {
            type: CreateType.Story,
            medias,
          })
        },
      })
    }
    return (
      <View style={styles.createBtn}>
        <Animated.View style={createBtnStyle} entering={ZoomIn}>
          <TouchableOpacity onPress={onCreatePress}>
            <CreateStorySvg size={84} />
          </TouchableOpacity>
        </Animated.View>
        <Padding top={7} />
        <Animated.View style={createBtnTextStyle}>
          <AppText color={Colors.white}>{t('home.create_story')}</AppText>
        </Animated.View>
      </View>
    )
  }, [])

  return (
    <Animated.View style={[styles.rootView, containerStyle]}>
      <FlatList
        data={stories}
        keyExtractor={item => `${item.story_id}`}
        ListHeaderComponent={CreateButton}
        horizontal
        renderItem={renderStoryItem}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Padding left={20} />}
        ListFooterComponent={<Padding right={20} />}
      />
    </Animated.View>
  )
}

export default memo(StoryBar)

const StoryItem = memo(({ item, index, scrollY }) => {
  const itemStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollY.value,
          [0, MAX_SCROLL_Y],
          [1, 0],
          Animated.Extrapolate.CLAMP,
        ),
      },
    ],
  }))
  const nameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, MAX_SCROLL_Y], [1, 0]),
  }))
  return (
    <Pressable>
      <Animated.View
        entering={ZoomIn.delay((index + 1) * 200)}
        style={[styles.storyAvatarView, itemStyle]}
      >
        <StoryGradientBorderSvg size={84} />
        <AppImage
          containerStyle={styles.avatarImg}
          source={{ uri: 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp' }}
        />
      </Animated.View>
      <Padding top={7} />
      <Animated.View style={nameStyle}>
        <AppText align="center" color={Colors.white}>
          VuCms
        </AppText>
      </Animated.View>
    </Pressable>
  )
})
const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.k222222,
    paddingBottom: 40,
  },

  createBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  storyAvatarView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    height: 68,
    width: 68,
    position: 'absolute',
    borderRadius: 28,
    zIndex: 99,
    overflow: 'hidden',
  },
})
