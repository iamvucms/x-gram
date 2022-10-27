import { CloseSvg, DotsSvg, StoryGradientBorderSvg } from '@/Assets/Svg'
import { AppImage, AppText, Container, Obx, Padding, Row } from '@/Components'
import { mockStories } from '@/Models'
import { goBack } from '@/Navigators'
import { Colors, screenHeight, screenWidth, XStyleSheet } from '@/Theme'
import { getHitSlop } from '@/Utils'
import { useLocalObservable } from 'mobx-react-lite'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const StoryScreen = () => {
  const listRef = useRef()
  const scrollX = useSharedValue(0)
  const state = useLocalObservable(() => ({
    stories: mockStories,
    index: 0,
    setIndex: index => (state.index = index),
    isActive: index => state.index === index,
  }))
  const renderStoryPageItem = useCallback(({ item, index }) => {
    return (
      <Obx>
        {() => (
          <StoryPage
            isActive={state.isActive(index)}
            scrollX={scrollX}
            story={item}
            index={index}
            onNextPage={() => {
              if (state.index < state.stories.length - 1) {
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
  const onScrollEnd = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth)
    state.setIndex(index)
  }
  return (
    <Container style={styles.rootView}>
      <Obx>
        {() => (
          <Animated.FlatList
            ref={listRef}
            onScroll={scrollHandler}
            onMomentumScrollEnd={onScrollEnd}
            horizontal
            pagingEnabled
            data={state.stories.slice()}
            renderItem={renderStoryPageItem}
            keyExtractor={item => item.story_id}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </Obx>
    </Container>
  )
}

export default StoryScreen
const StoryPage = memo(
  ({
    story,
    scrollX,
    index,
    isActive,
    onNextPage,
    onPrevPage,
    onOpenOption,
  }) => {
    const controlAnim = useSharedValue(1)
    const indexAnim = useSharedValue(-1)
    const inputRange = [screenWidth * (index - 1), screenWidth * (index + 1)]
    const state = useLocalObservable(() => ({
      index: 0,
      setIndex: value => (state.index = value),
    }))
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
            { duration: 0 },
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
            { duration: 0 },
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
    const { top } = useSafeAreaInsets()
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
                    {story.posted_by.user_id}
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
})
