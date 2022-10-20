import { AppBottomSheet, AppButton, Box, Container, Obx } from '@/Components'
import { useAppTheme } from '@/Hooks'
import {
  DrawColors,
  DrawGradientColors,
  DrawStrokeColors,
  getStickerPacks,
} from '@/Models'
import {
  Colors,
  Layout,
  ResponsiveHeight,
  screenHeight,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { randomRgb } from '@/Utils'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { BlurView } from '@react-native-community/blur'
import { useLocalObservable } from 'mobx-react-lite'
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ImageBackground, TouchableOpacity, View } from 'react-native'
import {
  FlatList,
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
} from 'react-native-gesture-handler'
import RNLinearGradient from 'react-native-linear-gradient'
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'

const ImageEditor = ({ route }) => {
  const { medias } = route.params || {}
  const viewShotRefs = useRef([]).current
  const sheetRef = useRef()
  const { Images } = useAppTheme()
  const stickerPacks = useMemo(
    () =>
      getStickerPacks({
        imageSource: Images,
      }),
    [Images],
  )
  const state = useLocalObservable(() => ({
    index: 0,
    backgroundBlurs: medias.map(() => 10),
    drawables: medias.map(() => false),
    packId: 1,
    stickers: medias.map(() => []),
    setIndex: value => (state.index = value),
    setBlur: value => (state.backgroundBlurs[state.index] = value),
    setDrawable: value => (state.drawables[state.index] = value),
    addSticker: sticker =>
      (state.stickers[state.index] = [...state.stickers[state.index], sticker]),
    removeSticker: sticker => {
      const stickers = state.stickers[state.index]
      const stickerIndex = stickers.indexOf(sticker)
      if (stickerIndex > -1) {
        stickers.splice(stickerIndex, 1)
      }
    },
    setPackId: value => (state.packId = value),
    get currentPackStickers() {
      return stickerPacks.find(item => item.id === this.packId).stickers
    },
  }))
  const onScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }) => {
      const nextIndex = Math.round(x / screenWidth)
      state.setIndex(nextIndex)
    },
    [],
  )
  const renderViewShotPage = useCallback(({ item, index }) => {
    return (
      <ViewShot
        ref={ref => (viewShotRefs[index] = ref)}
        style={styles.viewShot}
      >
        <Obx>
          {() => (
            <ImageBackground
              key={`bg-${index}`}
              blurRadius={state.backgroundBlurs[index]}
              style={styles.imageBackground}
              source={{
                uri: item.uri,
              }}
            />
          )}
        </Obx>
        <Obx>{() => <StickerLayer stickers={state.stickers[index]} />}</Obx>
        <Obx>
          {() => {
            return (
              <AnimatedImage
                onDrew={() => state.setDrawable(false)}
                image={item}
                drawable={state.drawables[index]}
              />
            )
          }}
        </Obx>
      </ViewShot>
    )
  }, [])

  const renderStickerItem = useCallback(({ item }) => {
    const onPress = () => {
      state.addSticker(item)
      sheetRef.current?.close()
    }
    return (
      <TouchableOpacity onPress={onPress} style={styles.stickerBtn}>
        <Image style={styles.stickerImg} source={item} />
      </TouchableOpacity>
    )
  }, [])
  return (
    <Container style={styles.rootView}>
      <FlatList
        pagingEnabled
        onMomentumScrollEnd={onScrollEnd}
        data={medias}
        renderItem={renderViewShotPage}
        keyExtractor={item => item.uri}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <AppButton
        style={{
          position: 'absolute',
          zIndex: 99,
          left: 0,
          bottom: 80,
        }}
        text="Draw"
        onPress={() => {
          // sheetRef.current?.snapTo(0)
          state.setDrawable(true)
        }}
      />
      <AppButton
        style={{
          position: 'absolute',
          zIndex: 99,
          right: 0,
          bottom: 80,
        }}
        text="Sticker"
        onPress={() => {
          sheetRef.current?.snapTo(0)
          // state.setDrawable(true)
        }}
      />
      <AppBottomSheet
        backgroundStyle={{ backgroundColor: Colors.transparent }}
        ref={sheetRef}
        snapPoints={[screenHeight * 0.55]}
      >
        <BlurView style={Layout.fill}>
          <BottomSheetFlatList
            numColumns={4}
            data={state.currentPackStickers.slice()}
            renderItem={renderStickerItem}
            keyExtractor={item => item}
          />
        </BlurView>
      </AppBottomSheet>
    </Container>
  )
}

export default ImageEditor
const AnimatedPath = Animated.createAnimatedComponent(Path)
const minStrokeBallY = -ResponsiveHeight(150)
const maxStrokeWidth = 50
const minStrokeWidth = 10
const AnimatedImage = memo(({ image, drawable, onDrew }) => {
  const { t } = useTranslation()
  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const rotation = useSharedValue(0)
  const panRef = useRef(null)
  const pinchRef = useRef(null)
  const rotationRef = useRef(null)
  const path = useSharedValue('')
  const colorIndex = useSharedValue(0)
  const animControl = useSharedValue(1)
  const strokeWidth = useSharedValue(10)
  const strokeBallY = useSharedValue(0)
  const state = useLocalObservable(() => ({
    paths: [],
    addPath: value => {
      state.paths.push(value)
    },
    popPath: () => {
      state.paths.pop()
    },
    colorIndex: 0,
    setColorIndex: value => {
      state.colorIndex = value
      colorIndex.value = value
    },
  }))

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.scale = scale.value
    },
    onActive: (event, ctx) => {
      scale.value = ctx.scale * event.scale
    },
  })
  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value
      ctx.startY = translateY.value
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX
      translateY.value = ctx.startY + event.translationY
    },
  })
  const rotationHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startRotation = rotation.value
    },
    onActive: (event, ctx) => {
      rotation.value = ctx.startRotation + event.rotation
    },
  })
  const drawHandler = useAnimatedGestureHandler({
    onStart: () => {
      animControl.value = withTiming(0)
    },
    onActive: event => {
      const { absoluteX, absoluteY } = event
      if (path.value === '') {
        path.value = `M${absoluteX},${absoluteY}`
      } else {
        path.value += `L${absoluteX} ${absoluteY}`
      }
    },
    onEnd: () => {
      runOnJS(state.addPath)({
        d: path.value,
        stroke: DrawStrokeColors[colorIndex.value],
        strokeWidth: strokeWidth.value,
      })
      path.value = ''
      animControl.value = withTiming(1)
    },
  })
  const pathProps = useAnimatedProps(() => ({
    d: path.value,
    strokeWidth: strokeWidth.value,
  }))
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
      {
        rotate: `${rotation.value}rad`,
      },
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  }))
  const strokeHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = strokeBallY.value
    },
    onActive: (event, ctx) => {
      const nextY = ctx.startY + event.translationY
      if (nextY >= minStrokeBallY && nextY <= 0) {
        strokeBallY.value = nextY
        strokeWidth.value =
          (strokeBallY.value / minStrokeBallY) *
            (maxStrokeWidth - minStrokeWidth) +
          minStrokeWidth
      }
    },
  })
  const strokeBallStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: strokeBallY.value,
      },
    ],
    width: strokeWidth.value + 3,
    height: strokeWidth.value + 3,
  }))
  const headerDrawControlStyle = useAnimatedStyle(() => ({
    opacity: animControl.value,
  }))
  const drawColorViewStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: (1 - animControl.value) * 50,
      },
    ],
  }))
  const drawStrokeViewStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: (1 - animControl.value) * 100,
      },
    ],
  }))
  const renderDrawColorItem = useCallback(({ item: color, index }) => {
    return (
      <Obx>
        {() => (
          <TouchableOpacity
            onPress={() => state.setColorIndex(index)}
            key={index}
            style={[
              styles.colorItem,
              {
                backgroundColor: color,
                borderColor:
                  state.colorIndex === index ? Colors.primary : Colors.white,
              },
            ]}
          >
            {!!Array.isArray(color) && (
              <RNLinearGradient colors={color} style={styles.linearGradient} />
            )}
          </TouchableOpacity>
        )}
      </Obx>
    )
  }, [])

  return (
    <Box fill>
      <PanGestureHandler onGestureEvent={drawHandler}>
        <Animated.View
          style={[
            styles.drawView,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              zIndex: drawable ? 100 : -100,
            },
          ]}
        />
      </PanGestureHandler>
      {drawable && (
        <View style={styles.drawControlView}>
          <Animated.View entering={FadeIn} style={headerDrawControlStyle}>
            <SafeAreaView>
              <Box
                row
                paddingVertical={10}
                align="center"
                justify="space-between"
                paddingHorizontal={16}
              >
                <AppButton
                  onPress={() => {
                    state.popPath()
                  }}
                  backgroundColor={Colors.black50}
                  text={t('undo')}
                />
                <AppButton backgroundColor={Colors.black50} text={t('done')} />
              </Box>
            </SafeAreaView>
          </Animated.View>
          <PanGestureHandler onGestureEvent={strokeHandler}>
            <Animated.View
              entering={FadeInRight}
              style={[styles.strokeWidthView, drawStrokeViewStyle]}
            >
              <View style={styles.strokeBar} />

              <Animated.View style={[styles.strokeBall, strokeBallStyle]}>
                <Obx>
                  {() =>
                    Array.isArray(DrawColors[state.colorIndex]) ? (
                      <RNLinearGradient
                        colors={DrawColors[state.colorIndex]}
                        style={Layout.fill}
                      />
                    ) : (
                      <Animated.View
                        style={[
                          Layout.fill,
                          {
                            backgroundColor: DrawColors[state.colorIndex],
                          },
                        ]}
                      />
                    )
                  }
                </Obx>
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
          <Animated.View entering={FadeInDown} style={drawColorViewStyle}>
            <Box height={44}>
              <FlatList
                data={DrawColors}
                horizontal
                renderItem={renderDrawColorItem}
                keyExtractor={(_, index) => index}
                showsHorizontalScrollIndicator={false}
              />
            </Box>
          </Animated.View>
        </View>
      )}
      <PinchGestureHandler
        ref={pinchRef}
        simultaneousHandlers={[panRef, rotationRef]}
        onGestureEvent={pinchHandler}
        minPointers={2}
      >
        <Animated.View style={Layout.fill}>
          <PanGestureHandler
            ref={panRef}
            minPointers={2}
            onGestureEvent={panHandler}
            simultaneousHandlers={[pinchRef, rotationRef]}
          >
            <Animated.View style={Layout.fill}>
              <RotationGestureHandler
                ref={rotationRef}
                minPointers={2}
                onGestureEvent={rotationHandler}
              >
                <Animated.View style={Layout.fill}>
                  <Obx>
                    {() => (
                      <Svg
                        style={styles.pathView}
                        height={screenHeight}
                        width={screenWidth}
                        viewBox={`0 0 ${screenWidth} ${screenHeight}`}
                      >
                        <Defs>
                          {DrawGradientColors.map((colors, index) => (
                            <LinearGradient
                              id={`grad${index}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <Stop offset="0" stopColor={colors[0]} />
                              <Stop offset="1" stopColor={colors[1]} />
                            </LinearGradient>
                          ))}
                        </Defs>
                        <Obx>
                          {() =>
                            state.paths.map((p, index) => (
                              <Path
                                strokeLinecap="round"
                                key={index}
                                d={p.d}
                                stroke={p.stroke}
                                strokeWidth={p.strokeWidth}
                              />
                            ))
                          }
                        </Obx>
                        {drawable && (
                          <Obx>
                            {() => (
                              <AnimatedPath
                                strokeLinecap="round"
                                stroke={DrawStrokeColors[state.colorIndex]}
                                animatedProps={pathProps}
                              />
                            )}
                          </Obx>
                        )}
                      </Svg>
                    )}
                  </Obx>
                  <Animated.View style={[Layout.fill, animatedStyle]}>
                    <Image
                      style={styles.imageView}
                      resizeMode="contain"
                      source={{ uri: image.uri }}
                    />
                  </Animated.View>
                </Animated.View>
              </RotationGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </Box>
  )
})
const StickerLayer = memo(({ stickers = [] }) => {
  const renderStickerItem = (sticker, index) => {
    return <Sticker sticker={sticker} key={index} />
  }
  return <Fragment>{stickers.map(renderStickerItem)}</Fragment>
})
const Sticker = memo(({ sticker }) => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value
      ctx.startY = translateY.value
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX
      translateY.value = ctx.startY + event.translationY
    },
  })
  const stickerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  }))
  return (
    <PanGestureHandler onGestureEvent={panHandler}>
      <Animated.View style={[styles.stickerItem, stickerStyle]}>
        <Image style={styles.stickerImg} source={sticker} />
      </Animated.View>
    </PanGestureHandler>
  )
})
const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  viewShot: {
    width: screenWidth,
    height: screenHeight,
    skipResponsive: true,
  },
  imageView: {
    height: '100%',
    width: '100%',
  },
  imageBackground: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  stickerBtn: {
    flex: 1,
    aspectRatio: 1,
    height: undefined,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickerImg: {
    width: (screenWidth / 4) * 0.8,
    height: (screenWidth / 4) * 0.8,
    resizeMode: 'contain',
  },
  stickerItem: {
    position: 'absolute',
    alignSelf: 'center',
    top: (screenHeight - (screenWidth / 4) * 0.8) / 2,
    zIndex: 99,
  },
  drawView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  drawControlView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'space-between',
  },
  pathView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  colorItem: {
    width: 24,
    height: 24,
    borderRadius: 99,
    borderWidth: 3,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginVertical: 10,
  },
  linearGradient: {
    flex: 1,
  },
  strokeWidthView: {
    skipResponsive: true,
    position: 'absolute',
    zIndex: 99,
    right: 0,
    paddingHorizontal: 20,
    top: (screenHeight - ResponsiveHeight(150)) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  strokeBar: {
    borderRadius: 5,
    height: 150,
    width: 5,
    backgroundColor: Colors.white,
  },
  strokeBall: {
    position: 'absolute',
    zIndex: 99,
    height: 26,
    width: 26,
    bottom: 0,
    borderRadius: 99,
    overflow: 'hidden',
    borderColor: Colors.white,
    borderWidth: 3,
  },
})
