import { CreateStorySvg, StoryGradientBorderSvg } from '@/Assets/Svg'
import { AppImage, AppText, Obx, Padding } from '@/Components'
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
import { useLocalObservable } from 'mobx-react-lite'
const MAX_SCROLL_Y = 100

const StoryBar = ({ stories = mockStories, scrollY }) => {
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    uploading: false,
    setUploading: value => (state.uploading = value),
  }))
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
        editable: true,
        editorProps: {
          type: CreateType.Story,
          onNext: medias => {
            navigate(PageName.HomeScreen)
            state.setUploading(true)
          },
        },
      })
    }
    return (
      <View style={styles.createBtn}>
        <Obx>
          {() =>
            state.uploading ? (
              <Animated.View></Animated.View>
            ) : (
              <Animated.View style={createBtnStyle} entering={ZoomIn}>
                <TouchableOpacity onPress={onCreatePress}>
                  <CreateStorySvg size={84} />
                </TouchableOpacity>
              </Animated.View>
            )
          }
        </Obx>
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

const StoryItem = memo(({ story, index, scrollY }) => {
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
          source={{ uri: story.posted_by.avatar_url }}
        />
      </Animated.View>
      <Padding top={7} />
      <Animated.View style={nameStyle}>
        <AppText align="center" color={Colors.white}>
          {story.posted_by.user_id}
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
