import { ArrowRightSvg, BallSvg, CheckSvg, ChevronRightSvg } from '@/Assets/Svg'
import {
  AppBottomSheet,
  AppText,
  Container,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { PageName } from '@/Config'
import { useAppTheme } from '@/Hooks'
import { navigate, navigateAndReset } from '@/Navigators'
import { appStore } from '@/Stores'
import {
  Colors,
  Layout,
  moderateScale,
  ResponsiveHeight,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { isAndroid } from '@/Utils'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useLocalObservable } from 'mobx-react-lite'
import React, { memo, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StatusBar, TouchableOpacity, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { Circle, Defs, LinearGradient, Stop, Svg } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const OnboardingScreen = () => {
  const { Images } = useAppTheme()
  const { t } = useTranslation()
  const scrollX = useSharedValue(0)

  const listRef = useRef()
  const state = useLocalObservable(() => ({
    currentPage: 0,
    setCurrentPage: index => (state.currentPage = index),
  }))

  const data = useMemo(
    () => [
      {
        title: t('videos'),
        description: t('onboarding.description'),
        shapes: [
          Images.abstractShape1,
          Images.abstractShape2,
          Images.abstractShape3,
          Images.abstractShape4,
        ],
      },
      {
        title: t('photos'),
        description: t('onboarding.description1'),
        shapes: [
          Images.clapperboard,
          Images.picture,
          Images.round,
          Images.square,
        ],
      },
      {
        title: t('reels'),
        description: t('onboarding.description2'),
        shapes: [Images.mozy, Images.heart, Images.enso, Images.star],
      },
    ],
    [t],
  )
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { x } }) => {
      scrollX.value = x
    },
  })

  const renderPageItem = ({ item, index }) => {
    return <PageItem data={item} scrollX={scrollX} index={index} />
  }

  const renderPageDotItem = (_, index) => {
    return <PageDot key={index} scrollX={scrollX} index={index} />
  }

  const backgroundStlye = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollX.value,
      [0, screenWidth, screenWidth * 2],
      [Colors.kE5AFAF, Colors.kC4BCFF, Colors.kC2D8BE],
    ),
  }))
  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(
      scrollX.value,
      [0, screenWidth, screenWidth * 2],
      [2 * Math.PI * 46 * 0.66, 2 * Math.PI * 46 * 0.33, 0],
      Extrapolation.CLAMP,
    ),
  }))

  const onNextPress = () => {
    if (state.currentPage === 2) {
      navigateAndReset([PageName.PreAuthStack], 0)
    } else {
      listRef.current?.scrollToIndex?.({
        index: state.currentPage + 1,
        animated: true,
      })
      if (isAndroid) {
        state.setCurrentPage(state.currentPage + 1)
      }
    }
  }

  return (
    <Container statusBarProps={{ barStyle: 'light-content' }} disableTop>
      <Animated.View style={[Layout.fill, backgroundStlye]}>
        <View style={styles.headerView}>
          <TouchableOpacity
            onPress={() => {
              appStore.setShowLanguageSheet(true)
            }}
            style={styles.skipBtn}
          >
            <AppText color={Colors.white} lineHeight={14} fontSize={14}>
              {t('choose_language')}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigate(PageName.PreAuthStack, {
                screen: PageName.PreAuthScreen,
              })
            }
            style={styles.skipBtn}
          >
            <AppText color={Colors.white} lineHeight={14} fontSize={14}>
              {t('skip')}
            </AppText>
            <ChevronRightSvg color={Colors.white} size={12} />
          </TouchableOpacity>
        </View>
        <Animated.FlatList
          onMomentumScrollEnd={({
            nativeEvent: {
              contentOffset: { x },
            },
          }) => state.setCurrentPage(Math.round(x / screenWidth))}
          ref={listRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={20}
          onScroll={scrollHandler}
          data={data}
          renderItem={renderPageItem}
          keyExtractor={(_, index) => `${index}`}
        />
        <View style={styles.footerView}>
          <View style={styles.pageIndicatorView}>
            {data.map(renderPageDotItem)}
          </View>
          <View style={[Layout.fill, Layout.center]}>
            <Svg
              height={moderateScale(95)}
              width={moderateScale(95)}
              viewBox="0 0 100 100"
            >
              <Defs>
                <LinearGradient id="circle" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={Colors.kFF7A51} />
                  <Stop offset="100%" stopColor={Colors.kFFDB5C} />
                </LinearGradient>
              </Defs>
              <AnimatedCircle
                transform="rotate(-90 50 50)"
                cx={50}
                cy={50}
                r={46}
                strokeWidth={2}
                stroke="url(#circle)"
                strokeDasharray={Math.PI * 2 * 46}
                strokeLinecap="round"
                animatedProps={circleProps}
              />
            </Svg>
            <TouchableOpacity onPress={onNextPress} style={styles.nextBtn}>
              <ArrowRightSvg color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Container>
  )
}

export default OnboardingScreen

const PageItem = memo(({ data, scrollX, index }) => {
  const inputRange = [
    (index - 1) * screenWidth,
    index * screenWidth,
    (index + 1) * screenWidth,
  ]
  const ballStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          scrollX.value,
          [0, screenWidth, screenWidth * 2],
          [0, 90, 180],
        )}deg`,
      },
    ],
  }))
  const descriptionStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollX.value,
          inputRange,
          [0.5, 1, 0.5],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0]),
  }))

  const bubble1Position = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollX.value, inputRange, [0, 1, 0]),
      },
      {
        translateX: interpolate(scrollX.value, inputRange, [0, 130, 0]),
      },
      {
        translateY: interpolate(scrollX.value, inputRange, [0, 130, 0]),
      },
    ],
  }))
  const bubble2Position = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollX.value, inputRange, [0, 1, 0]),
      },
      {
        translateX: interpolate(scrollX.value, inputRange, [0, -130, 0]),
      },
      {
        translateY: interpolate(scrollX.value, inputRange, [0, -130, 0]),
      },
    ],
  }))
  const bubble3Position = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollX.value, inputRange, [0, 1, 0]),
      },
      {
        translateX: interpolate(scrollX.value, inputRange, [0, 130, 0]),
      },
      {
        translateY: interpolate(scrollX.value, inputRange, [0, -130, 0]),
      },
    ],
  }))
  const bubble4Position = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollX.value, inputRange, [0, 1, 0]),
      },
      {
        translateX: interpolate(scrollX.value, inputRange, [0, -130, 0]),
      },
      {
        translateY: interpolate(scrollX.value, inputRange, [0, 130, 0]),
      },
    ],
  }))
  return (
    <Animated.View style={[styles.pageItem]}>
      <View style={Layout.center}>
        <View style={Layout.center}>
          <Animated.View style={ballStyle}>
            <BallSvg size={300} />
          </Animated.View>
          <AppText
            fontWeight={700}
            style={styles.titleTxt}
            color={Colors.white}
            fontSize={58}
            lineHeight={76}
          >
            {data.title}
          </AppText>
        </View>
        <Animated.View style={[styles.bubbleItem, bubble1Position]}>
          <Image
            source={data.shapes[0]}
            style={{ transform: [{ scale: 0.5 }] }}
          />
        </Animated.View>
        <Animated.View style={[styles.bubbleItem, bubble2Position]}>
          <Image
            source={data.shapes[1]}
            style={{ transform: [{ scale: 0.5 }] }}
          />
        </Animated.View>
        <Animated.View style={[styles.bubbleItem, bubble3Position]}>
          <Image
            source={data.shapes[2]}
            style={{ transform: [{ scale: 0.5 }] }}
          />
        </Animated.View>
        <Animated.View style={[styles.bubbleItem, bubble4Position]}>
          <Image
            source={data.shapes[3]}
            style={{ transform: [{ scale: 0.5 }] }}
          />
        </Animated.View>
      </View>

      <View style={styles.descriptionView}>
        <Animated.View style={descriptionStyle}>
          <AppText align="center" color={Colors.white} fontSize={24}>
            {data.description}
          </AppText>
        </Animated.View>
      </View>
    </Animated.View>
  )
})

const PageDot = memo(({ scrollX, index }) => {
  const inputRange = [
    screenWidth * (index - 1),
    screenWidth * index,
    screenWidth * (index + 1),
  ]
  const dotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      scrollX.value,
      inputRange,
      [8, 34, 8],
      Extrapolation.CLAMP,
    ),
  }))
  return <Animated.View style={[styles.pageDot, dotStyle]} />
})

const styles = XStyleSheet.create({
  pageItem: {
    flex: 1,
    width: screenWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
    skipResponsive: true,
    overflow: 'hidden',
    paddingBottom: ResponsiveHeight(23),
  },
  titleTxt: {
    position: 'absolute',
    zIndex: 99,
  },
  descriptionView: {
    paddingHorizontal: 30,
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  peopleImg: {
    width: 178,
    aspectRatio: 534 / 207,
    height: undefined,
    marginBottom: 22,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'space-between',
  },
  skipBtn: {
    skipResponsive: true,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  pageIndicatorView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  pageDot: {
    height: 6,
    borderRadius: 99,
    backgroundColor: Colors.white,
    marginHorizontal: 4,
  },
  footerView: {
    height: 200,
  },

  nextBtn: {
    position: 'absolute',
    zIndex: 10,
    height: 62,
    width: 62,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: Colors.k222222,
  },
  bubbleItem: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0.3,
  },
})
