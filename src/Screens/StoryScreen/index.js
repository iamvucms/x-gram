import {
  CloseSvg,
  DotsSvg,
  ReportSvg,
  SendSvg,
  ShareSvg,
  StoryGradientBorderSvg,
  TrashBinSvg,
} from '@/Assets/Svg'
import {
  AppBottomSheet,
  AppImage,
  AppInput,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
  Row,
  ShareBottomSheet,
} from '@/Components'
import { ShareType } from '@/Models'
import { goBack } from '@/Navigators'
import { diaLogStore, homeStore, userStore } from '@/Stores'
import { Colors, Layout, XStyleSheet, screenHeight, screenWidth } from '@/Theme'
import { getHitSlop } from '@/Utils'
import { useKeyboard } from '@react-native-community/hooks'
import { useLocalObservable } from 'mobx-react-lite'
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const StoryScreen = ({ route }) => {
  const { storyId } = route?.params || {}
  const defaultIndex = homeStore.stories.findIndex(
    item => item.story_id === storyId,
  )
  const optionRef = useRef()
  const listRef = useRef()
  const pageRefs = useRef([])
  const { t } = useTranslation()
  const scrollX = useSharedValue(0)
  const state = useLocalObservable(() => ({
    index: defaultIndex,
    selectedStory: null,
    shareSheetVisible: false,
    setIndex: index => (state.index = index),
    isActive: index => state.index === index,
    setSelectedStory: story => (state.selectedStory = story),
    setShareSheetVisible: visible => (state.shareSheetVisible = visible),
  }))
  const renderStoryPageItem = useCallback(({ item, index }) => {
    return (
      <Obx>
        {() => (
          <StoryPage
            ref={ref => (pageRefs.current[index] = ref)}
            isActive={state.isActive(index)}
            scrollX={scrollX}
            story={item}
            index={index}
            onReply={() => {}}
            onOpenOption={() => {
              pageRefs.current[index]?.pause?.()
              state.setSelectedStory(item)
              optionRef.current?.snapTo?.(0)
            }}
            onNextPage={() => {
              if (state.index < homeStore.stories.length - 1) {
                listRef.current?.scrollToIndex({ index: index + 1 })
                state.setIndex(index + 1)
              }
            }}
            onPrevPage={() => {
              if (state.index > 0) {
                listRef.current?.scrollToIndex({ index: index - 1 })
                state.setIndex(index - 1)
              }
            }}
          />
        )}
      </Obx>
    )
  }, [])
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x
    },
  })
  const closeOptionSheet = () => {
    optionRef.current?.close?.()
    pageRefs.current[state.index]?.resume?.()
  }
  const onScrollEnd = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth)
    state.setIndex(index)
  }
  return (
    <Container style={styles.rootView} disableTop>
      <Obx>
        {() => (
          <Animated.FlatList
            initialScrollIndex={defaultIndex}
            onScrollToIndexFailed={() => {
              setTimeout(() => {
                listRef.current?.scrollToIndex({ index: defaultIndex })
              }, 500)
            }}
            ref={listRef}
            onScroll={scrollHandler}
            onMomentumScrollEnd={onScrollEnd}
            horizontal
            pagingEnabled
            data={homeStore.stories.slice()}
            renderItem={renderStoryPageItem}
            keyExtractor={item => item.story_id}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </Obx>
      <AppBottomSheet
        backgroundStyle={styles.sheetHeader}
        ref={optionRef}
        snapPoints={[screenHeight * 0.3]}
        handleIndicatorStyle={{ backgroundColor: Colors.white50 }}
        onClose={closeOptionSheet}
      >
        <Box
          topLeftRadius={16}
          topRightRadius={16}
          fill
          backgroundColor={Colors.white}
        >
          <Box
            height={50}
            center
            borderBottomWidth={0.5}
            borderBottomColor={Colors.border}
          >
            <AppText fontSize={16} fontWeight={700}>
              {t('home.story_options')}
            </AppText>
            <TouchableOpacity
              onPress={closeOptionSheet}
              style={styles.closeBtn}
            >
              <CloseSvg />
            </TouchableOpacity>
          </Box>
          <Obx>
            {() =>
              !!state.selectedStory && (
                <>
                  <Obx>
                    {() =>
                      state.selectedStory.posted_by.user_id ===
                      userStore.userInfo.user_id ? (
                        <TouchableOpacity
                          onPress={() => {
                            closeOptionSheet()
                            const media =
                              state.selectedStory.medias[state.index]
                            diaLogStore.showDiaLog({
                              title: t('home.delete_story'),
                              message: t('home.delete_story_confirm'),
                              showCancelButton: true,
                              onPress: () =>
                                homeStore.deleteStory(
                                  media.story_id,
                                  media.media_id,
                                ),
                            })
                          }}
                          style={styles.optionBtn}
                        >
                          <TrashBinSvg size={20} />
                          <Padding left={14} />
                          <AppText fontSize={16} fontWeight={500}>
                            {t('home.delete_story')}
                          </AppText>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {}}
                          style={styles.optionBtn}
                        >
                          <ReportSvg size={20} />
                          <Padding left={14} />
                          <AppText fontSize={16} fontWeight={500}>
                            {t('home.report_story')}
                          </AppText>
                        </TouchableOpacity>
                      )
                    }
                  </Obx>
                  <TouchableOpacity
                    onPress={() => {
                      state.setShareSheetVisible(true)
                    }}
                    style={styles.optionBtn}
                  >
                    <ShareSvg size={20} />
                    <Padding left={14} />
                    <AppText fontSize={16} fontWeight={500}>
                      {t('home.share_story')}
                    </AppText>
                  </TouchableOpacity>
                </>
              )
            }
          </Obx>
        </Box>
      </AppBottomSheet>
      <Obx>
        {() =>
          state.shareSheetVisible && (
            <ShareBottomSheet
              type={ShareType.Story}
              data={state.selectedStory}
              onClose={() => {
                state.setShareSheetVisible(false)
                closeOptionSheet()
              }}
            />
          )
        }
      </Obx>
    </Container>
  )
}

export default StoryScreen
const StoryPage = forwardRef(
  (
    {
      story,
      scrollX,
      index,
      isActive,
      onNextPage,
      onPrevPage,
      onOpenOption,
      onReply,
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const controlAnim = useSharedValue(1)
    const indexAnim = useSharedValue(-1)
    const inputRange = [screenWidth * (index - 1), screenWidth * (index + 1)]
    const state = useLocalObservable(() => ({
      index: 0,
      replyMessage: '',
      setIndex: value => (state.index = value),
      setReplyMessage: value => (state.replyMessage = value),
    }))
    const { keyboardHeight, keyboardShown } = useKeyboard()
    const keyboard = useDerivedValue(
      () =>
        !isActive
          ? 0
          : (keyboardShown ? withSpring : withTiming)(
              keyboardShown ? keyboardHeight : 0,
            ),
      [keyboardHeight, keyboardShown, isActive],
    )
    const indicatorWidth =
      (screenWidth - 32 - 5 * (story.medias.length - 1)) / story.medias.length
    const animateIndex = () => {
      const callback = () => {
        if (state.index < story.medias.length - 1) {
          state.setIndex(state.index + 1)
          indexAnim.value = withTiming(
            state.index,
            {
              duration: 8000 * (state.index - indexAnim.value),
              easing: Easing.linear,
            },
            isFinished => isFinished && runOnJS(callback)(),
          )
        } else {
          state.setIndex(0)
          indexAnim.value = -1
          onNextPage && onNextPage()
        }
      }
      indexAnim.value = withTiming(
        state.index,
        {
          duration: 8000 * (state.index - indexAnim.value),
          easing: Easing.linear,
        },
        isFinished => isFinished && runOnJS(callback)(),
      )
    }
    useImperativeHandle(ref, () => ({
      pause: () => (indexAnim.value = indexAnim.value),
      resume: animateIndex,
    }))
    useEffect(() => {
      if (isActive) {
        animateIndex()
      } else {
        indexAnim.value = Math.floor(indexAnim.value)
      }
    }, [isActive])
    const pageStyle = useAnimatedStyle(() => ({
      transform: [
        { perspective: 400 },

        {
          rotateY: `${interpolate(
            scrollX.value,
            inputRange,
            [-45, 45],
            Extrapolation.CLAMP,
          )}deg`,
        },
        {
          translateX: interpolate(
            scrollX.value,
            inputRange,
            [-screenWidth / 4, screenWidth / 4],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }))
    const headerStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: interpolate(
            controlAnim.value,
            [0, 1],
            [-200, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }))
    const bottomStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: interpolate(
            controlAnim.value,
            [0, 1],
            [200, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }))
    const inputContainerStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: -keyboard.value,
        },
      ],
    }))
    const renderIndicatorItem = useCallback((_, indicatorIndex) => {
      return (
        <StoryPageIndicator
          key={indicatorIndex}
          width={indicatorWidth}
          indexAnim={indexAnim}
          index={indicatorIndex}
        />
      )
    }, [])
    const onPress = useCallback(e => {
      const pageX = e.nativeEvent.pageX
      if (pageX < screenWidth / 2) {
        if (state.index > 0) {
          state.setIndex(state.index - 1)
          indexAnim.value = withTiming(
            state.index - 1,
            { duration: 250 },
            isFinished => isFinished && runOnJS(animateIndex)(),
          )
        } else {
          onPrevPage && onPrevPage()
        }
      } else if (pageX > screenWidth / 2) {
        if (state.index < story.medias.length - 1) {
          state.setIndex(state.index + 1)
          indexAnim.value = withTiming(
            state.index - 1,
            { duration: 250 },
            isFinished => isFinished && runOnJS(animateIndex)(),
          )
        } else {
          onNextPage && onNextPage()
        }
      }
    }, [])
    const onPausePress = useCallback(() => {
      controlAnim.value = withTiming(0)
      indexAnim.value = indexAnim.value
    }, [])
    const onResumePress = useCallback(() => {
      if (controlAnim.value === 0) {
        controlAnim.value = withTiming(1)
        animateIndex()
      }
    }, [])
    const onReplyPress = useCallback(() => {
      onReply && onReply(state.replyMessage)
      state.setReplyMessage('')
    }, [])
    const { top, bottom } = useSafeAreaInsets()
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onPausePress}
        onPressOut={onResumePress}
      >
        <Animated.View style={[styles.storyPage, pageStyle]}>
          <Obx>
            {() => (
              <AppImage
                disabled
                style={styles.storyImage}
                source={{
                  uri: story.medias[state.index].url,
                }}
              />
            )}
          </Obx>
          <Animated.View
            style={[
              styles.headerControl,
              headerStyle,
              {
                paddingTop: top + 10,
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.black50, Colors.transparent]}
              style={styles.shadowView}
            />
            <Row justify="space-between">
              {story.medias.map(renderIndicatorItem)}
            </Row>
            <Padding top={12} />
            <Row align="center" justify="space-between">
              <Row>
                <View style={styles.avatarView}>
                  <StoryGradientBorderSvg size={54} />
                  <AppImage
                    containerStyle={styles.avatarImg}
                    source={{
                      uri: story.posted_by.avatar_url,
                    }}
                  />
                </View>
                <Padding left={12}>
                  <AppText fontWeight={700} color={Colors.white}>
                    {story.posted_by.user_name}
                  </AppText>
                  <AppText color={Colors.white50}>4h ago</AppText>
                </Padding>
              </Row>
              <Row>
                <TouchableOpacity
                  onPress={() => onOpenOption && onOpenOption()}
                  hitSlop={getHitSlop(16)}
                >
                  <DotsSvg color={Colors.white} />
                </TouchableOpacity>
                <Padding left={10} />
                <TouchableOpacity
                  onPress={() => goBack()}
                  hitSlop={getHitSlop(16)}
                >
                  <CloseSvg size={30} color={Colors.white} />
                </TouchableOpacity>
              </Row>
            </Row>
          </Animated.View>

          <Animated.View
            style={[
              styles.bottomControl,
              bottomStyle,
              {
                paddingBottom: bottom || 16,
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.transparent, Colors.black50]}
              style={styles.shadowView}
            />
            <Animated.View style={inputContainerStyle}>
              <Box
                row
                align="center"
                height={50}
                radius={99}
                borderWidth={1}
                borderColor={Colors.white}
                paddingRight={6}
                paddingLeft={12}
              >
                <Obx>
                  {() => (
                    <AppInput
                      autoCorrect={false}
                      style={Layout.fill}
                      fontWeight={500}
                      color={Colors.white}
                      placeholder={t('message_placeholder')}
                      placeholderTextColor={Colors.white50}
                      value={state.replyMessage}
                      onChangeText={txt => state.setReplyMessage(txt)}
                      onSubmitEditing={onReplyPress}
                    />
                  )}
                </Obx>

                <TouchableOpacity onPress={onReplyPress} style={styles.sendBtn}>
                  <SendSvg size={16} color={Colors.white} />
                </TouchableOpacity>
              </Box>
            </Animated.View>
          </Animated.View>
          <Padding />
        </Animated.View>
      </Pressable>
    )
  },
)
const StoryPageIndicator = memo(({ indexAnim, index, width }) => {
  const indicatorStyle = useAnimatedStyle(() => ({
    width: interpolate(
      indexAnim.value,
      [index - 1, index],
      [0, width],
      Extrapolation.CLAMP,
    ),
  }))
  return (
    <View style={[styles.indicatorView, { width }]}>
      <Animated.View style={[styles.indicator, indicatorStyle]} />
    </View>
  )
})
const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  storyPage: {
    height: screenHeight,
    width: screenWidth,
    skipResponsive: true,
    borderRadius: 10,
    overflow: 'hidden',
  },
  storyImage: {
    height: screenHeight,
    width: screenWidth,
    skipResponsive: true,
  },
  headerControl: {
    paddingHorizontal: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 99,
  },
  bottomControl: {
    paddingHorizontal: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  shadowView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  avatarView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    height: 44,
    width: 44,
    borderRadius: 20,
    position: 'absolute',
    zIndex: 10,
    overflow: 'hidden',
  },
  indicatorView: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: Colors.white50,
  },
  indicator: {
    height: 4,
    backgroundColor: Colors.white,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sheetHeader: {
    opacity: 0,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
