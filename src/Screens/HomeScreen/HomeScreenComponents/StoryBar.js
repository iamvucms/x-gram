import { CreateStorySvg, StoryGradientBorderSvg } from '@/Assets/Svg'
import {
  AppImage,
  AppText,
  Box,
  LoadingIndicator,
  Obx,
  Padding,
} from '@/Components'
import { PageName } from '@/Config'
import { CreateType, MediaType, mockStories } from '@/Models'
import { navigate } from '@/Navigators'
import { Colors, XStyleSheet } from '@/Theme'
import { useLocalObservable } from 'mobx-react-lite'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  ZoomIn,
} from 'react-native-reanimated'
const MAX_SCROLL_Y = 100

const StoryBar = ({ stories = mockStories, scrollY }) => {
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    uploadingMedias: [],
    uploading: false,
    setUploading: value => (state.uploading = value),
    setUploadingMedias: medias => (state.uploadingMedias = medias),
  }))
  useEffect(() => {}, [])
  const renderStoryItem = useCallback(({ item, index }) => {
    const onPress = () => {
      navigate(PageName.StoryScreen, { story: item })
    }
    return (
      <StoryItem
        onPress={onPress}
        story={item}
        index={index}
        scrollY={scrollY}
      />
    )
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
  const onNext = medias => {
    navigate(PageName.HomeScreen)
    state.setUploading(true)
    state.setUploadingMedias(medias)
    //TODO create story

    // state.setUploading(false)
    // state.setUploadingMedias([])
  }

  const CreateButton = useMemo(() => {
    const onCreatePress = () => {
      navigate(PageName.MediaPicker, {
        multiple: true,
        editable: true,
        type: MediaType.Photo,
        editorProps: {
          type: CreateType.Story,
          onNext,
        },
      })
    }
    return (
      <View style={styles.createBtn}>
        <Obx>
          {() =>
            state.uploading ? (
              <Animated.View entering={ZoomIn}>
                <View style={styles.creatingStoryView}>
                  <Box overflow="hidden" radius={27} fill row flexWrap="wrap">
                    <View style={styles.uploadIcView}>
                      <LoadingIndicator color={Colors.white} />
                    </View>
                    <Obx>
                      {() => {
                        const width =
                          state.uploadingMedias.length > 1 ? '50%' : '100%'
                        const height =
                          state.uploadingMedias.length > 2 ? '50%' : '100%'
                        return state.uploadingMedias
                          .slice(0, 4)
                          .map((media, index) => (
                            <Image
                              key={index}
                              // eslint-disable-next-line react-native/no-inline-styles
                              style={{
                                width:
                                  state.uploadingMedias.length === 3 &&
                                  index === 2
                                    ? '100%'
                                    : width,
                                height,
                              }}
                              source={{
                                uri: media.uri,
                              }}
                            />
                          ))
                      }}
                    </Obx>
                  </Box>
                </View>
              </Animated.View>
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
          <AppText color={Colors.white}>
            <Obx>
              {() =>
                state.uploading
                  ? t('home.creating_story')
                  : t('home.create_story')
              }
            </Obx>
          </AppText>
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

const StoryItem = memo(({ story, index, scrollY, onPress }) => {
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
    <View>
      <Animated.View
        entering={ZoomIn.delay((index + 1) * 200)}
        style={[styles.storyAvatarView, itemStyle]}
      >
        <StoryGradientBorderSvg size={84} />
        <AppImage
          onPress={onPress}
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
    </View>
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
  creatingStoryView: {
    height: 84,
    width: 84,
    borderRadius: 38,
    borderColor: Colors.kF8F8F8,
    borderWidth: 2,
    overflow: 'hidden',
    padding: 6,
  },
  creatingStoryImage: {
    backgroundColor: 'red',
  },
  uploadIcView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 99,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black50,
  },
})
