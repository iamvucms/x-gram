import {
  AlignCenterSvg,
  AlignLeftSvg,
  AlignRightSvg,
  CloseSvg,
  DrawSvg,
  SolidTextSvg,
  StickerSvg,
  TextSvg,
  TrashBinSvg,
} from '@/Assets/Svg'
import {
  AppButton,
  AppGradientText,
  AppText,
  Box,
  Container,
  KeyboardSpacer,
  LoadingIndicator,
  Obx,
  Position,
  Row,
  StickerPickerSheet,
} from '@/Components'
import {
  CreateType,
  DrawColors,
  DrawGradientColors,
  DrawStrokeColors,
  TextAlignType,
  TextType,
} from '@/Models'
import { goBack } from '@/Navigators'
import {
  Colors,
  Layout,
  ResponsiveHeight,
  screenHeight,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { getHitSlop, isIOS } from '@/Utils'
import { useLocalObservable } from 'mobx-react-lite'
import React, { Fragment, memo, useCallback, useMemo, useRef } from 'react'
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
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'
const ImageEditor = ({ route }) => {
  const { medias, onNext, type } = route.params || {}
  const { t } = useTranslation()
  const viewShotRefs = useRef([]).current
  const sheetRef = useRef()
  const listRef = useRef()
  const { top } = useSafeAreaInsets()
  const trashY = useSharedValue(0)
  const trashAnim = useSharedValue(0)

  const state = useLocalObservable(() => ({
    index: 0,
    backgroundBlurs: medias.map(() => 10),
    drawables: medias.map(() => false),
    stickers: medias.map(() => []),
    editText: false,
    texts: medias.map(() => []),
    processing: false,
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
    setEditText: value => (state.editText = value),
    addText: text =>
      (state.texts[state.index] = [...state.texts[state.index], text]),
    removeText: index => state.texts[state.index].splice(index, 1),
    setProcessing: value => (state.processing = value),
    get toolBarVisible() {
      return state.drawables.every(item => !item) && !state.editText
    },
    get lastZIndex() {
      return Math.max(
        [...state.stickers[state.index]].pop()?.zIndex || 99,
        [...state.texts[state.index]].pop()?.zIndex || 99,
      )
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
  const trashBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: (1 - trashY.value) * 60,
      },
    ],
  }))
  const trashBgStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: trashAnim.value,
      },
    ],
  }))
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

        <Obx>
          {() => (
            <StickerLayer
              trashAnim={trashAnim}
              trashY={trashY}
              stickers={state.stickers[index]}
            />
          )}
        </Obx>

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
        <Obx>
          {() => (
            <TextLayer
              trashAnim={trashAnim}
              trashY={trashY}
              texts={state.texts[index]}
            />
          )}
        </Obx>
      </ViewShot>
    )
  }, [])

  const onNextPress = useCallback(async () => {
    state.setProcessing(true)
    try {
      const processMedias = []
      for (let i = 0; i < viewShotRefs.length; i++) {
        const uri = await viewShotRefs[i].capture()
        processMedias.push({
          uri,
          mimeType: 'image/png',
        })
        if (i < viewShotRefs.length - 1) {
          listRef.current?.scrollToIndex({ index: i + 1, animated: true })
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }
      onNext && onNext(processMedias)
    } catch (e) {
      console.log(e)
    }
    state.setProcessing(false)
  }, [])
  const { bottom } = useSafeAreaInsets()
  return (
    <Container disableTop style={styles.rootView}>
      <Obx>
        {() => (
          <FlatList
            ref={listRef}
            scrollEnabled={state.toolBarVisible}
            pagingEnabled
            onMomentumScrollEnd={onScrollEnd}
            data={medias}
            renderItem={renderViewShotPage}
            keyExtractor={item => item.uri}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </Obx>
      <Obx>
        {() =>
          state.toolBarVisible && (
            <>
              <TouchableOpacity
                onPress={() => goBack()}
                hitSlop={getHitSlop(16)}
                style={[styles.closeBtn, { top: top + 10 }]}
              >
                <CloseSvg size={30} color={Colors.white} />
              </TouchableOpacity>
              <Animated.View
                entering={FadeInRight}
                style={[styles.toolBar, { top: top + 10 }]}
              >
                <TouchableOpacity
                  onPress={() => sheetRef.current?.snapTo(0)}
                  style={styles.toolBarBtn}
                >
                  <StickerSvg color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    state.setEditText(true)
                    sheetRef.current?.close()
                  }}
                  style={styles.toolBarBtn}
                >
                  <TextSvg size={20} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    state.setDrawable(true)
                    sheetRef.current?.close()
                  }}
                  style={styles.toolBarBtn}
                >
                  <DrawSvg size={20} color={Colors.white} />
                </TouchableOpacity>
              </Animated.View>
              <AppButton
                onPress={onNextPress}
                text={type === CreateType.Story ? t('create') : t('next')}
                backgroundColor={Colors.black50}
                style={styles.nextBtn}
              />
            </>
          )
        }
      </Obx>
      <Obx>
        {() =>
          state.editText && (
            <TextEditor
              onClose={() => state.setEditText(false)}
              onDone={text => {
                state.addText({
                  ...text,
                  zIndex: state.lastZIndex + 1,
                })
                state.setEditText(false)
              }}
            />
          )
        }
      </Obx>
      <StickerPickerSheet
        ref={sheetRef}
        onSelectSticker={sticker => {
          state.addSticker({
            src: sticker,
            zIndex: state.lastZIndex + 1,
          })
          sheetRef.current?.close?.()
        }}
      />
      <Animated.View
        style={[
          styles.trashBar,
          {
            height: ResponsiveHeight(50) + bottom / 2,
          },
          trashBarStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.trashBarBg,
            {
              height: ResponsiveHeight(50) + bottom / 2,
            },
            trashBgStyle,
          ]}
        />
        <TrashBinSvg color={Colors.white} />
        <AppText color={Colors.white} fontSize={10}>
          {t('imageEditor.dragHereToRemove')}
        </AppText>
      </Animated.View>
      <Obx>
        {() => <LoadingIndicator overlayVisible={state.processing} overlay />}
      </Obx>
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
  const { bottom } = useSafeAreaInsets()
  return (
    <Box fill>
      <PanGestureHandler onGestureEvent={drawHandler}>
        <Animated.View
          style={[
            styles.drawView,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              zIndex: drawable ? 100 : -101,
            },
          ]}
        />
      </PanGestureHandler>
      {drawable && (
        <Fragment>
          <Animated.View
            entering={FadeIn}
            style={[styles.headerDrawControlView, headerDrawControlStyle]}
          >
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
                  style={styles.drawControlBtn}
                  backgroundColor={Colors.black50}
                  text={t('undo')}
                />
                <AppButton
                  onPress={() => onDrew && onDrew()}
                  style={styles.drawControlBtn}
                  backgroundColor={Colors.black50}
                  text={t('done')}
                />
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
          <Animated.View
            entering={FadeInDown}
            style={[styles.bottomDrawControlView, drawColorViewStyle]}
          >
            <Box height={44 + bottom / 2}>
              <FlatList
                data={DrawColors}
                horizontal
                renderItem={renderDrawColorItem}
                keyExtractor={(_, index) => index}
                showsHorizontalScrollIndicator={false}
              />
            </Box>
          </Animated.View>
        </Fragment>
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
                              key={index}
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
const StickerLayer = memo(({ stickers = [], trashAnim, trashY }) => {
  const renderStickerItem = useCallback((sticker, index) => {
    return (
      <Sticker
        trashAnim={trashAnim}
        trashY={trashY}
        sticker={sticker}
        key={index}
      />
    )
  }, [])

  return stickers.map(renderStickerItem)
})

const Sticker = memo(({ sticker, trashY, trashAnim }) => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const zIndex = useSharedValue(sticker.zIndex)
  const { bottom } = useSafeAreaInsets()
  const activeStickerTrashY = useMemo(
    () =>
      screenHeight / 2 -
      (screenWidth / 4) * 0.4 -
      ResponsiveHeight(50) -
      bottom / 2,
    [bottom],
  )
  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value
      ctx.startY = translateY.value
      trashY.value = withTiming(1)
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX
      translateY.value = ctx.startY + event.translationY
      if (translateY.value >= activeStickerTrashY && trashAnim.value === 0) {
        trashAnim.value = withTiming(1)
      } else if (
        translateY.value < activeStickerTrashY &&
        trashAnim.value === 1
      ) {
        trashAnim.value = withTiming(0)
      }
    },
    onEnd: () => {
      trashY.value = withTiming(0)
      if (translateY.value >= activeStickerTrashY) {
        zIndex.value = -99
        trashAnim.value = withTiming(0)
      }
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
    zIndex: zIndex.value,
  }))
  return (
    <PanGestureHandler onGestureEvent={panHandler}>
      <Animated.View style={[styles.stickerItem, stickerStyle]}>
        <Image style={styles.stickerImg} source={sticker.src} />
      </Animated.View>
    </PanGestureHandler>
  )
})
const TextEditor = memo(({ onDone, onClose }) => {
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    text: '',
    align: TextAlignType.Center,
    colorIndex: 0,
    type: TextType.WhiteBox,
    setText: text => (state.text = text),
    setAlign: align => (state.align = align),
    setColorIndex: colorIndex => (state.colorIndex = colorIndex),
    setType: type => (state.type = type),
    get colors() {
      const color = DrawColors[this.colorIndex]
      return typeof color === 'string' ? [color, color] : color
    },
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
    <View style={styles.textEditor}>
      <Box fill center>
        <Animated.View style={[styles.textHeaderView]}>
          <SafeAreaView>
            <Box
              paddingHorizontal={16}
              paddingTop={10}
              row
              align="center"
              justify="space-between"
            >
              <AppButton
                onPress={onClose}
                text={t('cancel')}
                backgroundColor={Colors.black50}
              />
              <Row align="center" row>
                <TouchableOpacity
                  hitSlop={getHitSlop(10)}
                  style={styles.textHeaderBtn}
                  onPress={() => {
                    if (state.type === TextType.WhiteBox) {
                      state.setType(TextType.Revert)
                    } else if (state.type === TextType.Revert) {
                      state.setType(TextType.Normal)
                    } else {
                      state.setType(TextType.WhiteBox)
                    }
                  }}
                >
                  <Obx>
                    {() =>
                      state.type === TextType.WhiteBox ? (
                        <SolidTextSvg color={Colors.white} />
                      ) : state.type === TextType.Normal ? (
                        <TextSvg size={22} color={Colors.white} />
                      ) : (
                        <Obx>
                          {() => <SolidTextSvg color={state.colors[0]} />}
                        </Obx>
                      )
                    }
                  </Obx>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (state.align === TextAlignType.Left) {
                      state.setAlign(TextAlignType.Center)
                    } else if (state.align === TextAlignType.Center) {
                      state.setAlign(TextAlignType.Right)
                    } else {
                      state.setAlign(TextAlignType.Left)
                    }
                  }}
                  hitSlop={getHitSlop(10)}
                  style={styles.textHeaderBtn}
                >
                  <Obx>
                    {() =>
                      state.align === TextAlignType.Center ? (
                        <AlignCenterSvg color={Colors.white} />
                      ) : state.align === TextAlignType.Left ? (
                        <AlignLeftSvg color={Colors.white} />
                      ) : (
                        <AlignRightSvg color={Colors.white} />
                      )
                    }
                  </Obx>
                </TouchableOpacity>
              </Row>
              <Obx>
                {() => (
                  <AppButton
                    disabled={!state.text}
                    onPress={() =>
                      onDone({
                        text: state.text,
                        align: state.align,
                        colors: state.colors,
                        type: state.type,
                      })
                    }
                    disabledBackgroundColor={Colors.black50}
                    text={t('done')}
                    backgroundColor={Colors.black50}
                  />
                )}
              </Obx>
            </Box>
          </SafeAreaView>
        </Animated.View>
        <Obx>
          {() => (
            <XText
              text={state.text}
              onChangeText={txt => state.setText(txt)}
              colors={state.colors}
              type={state.type}
              align={state.align}
              isEditing
            />
          )}
        </Obx>
        <Position bottom={0} left={0} right={0} zIndex={99}>
          <Box height={44}>
            <FlatList
              keyboardShouldPersistTaps="always"
              data={DrawColors}
              horizontal
              renderItem={renderDrawColorItem}
              keyExtractor={(_, index) => index}
              showsHorizontalScrollIndicator={false}
            />
          </Box>
        </Position>
      </Box>
      {isIOS && <KeyboardSpacer />}
    </View>
  )
})

const TextLayer = memo(({ texts, trashY, trashAnim }) => {
  const renderTextItem = useCallback(
    (txt, index) => (
      <XText trashY={trashY} trashAnim={trashAnim} key={index} {...txt} />
    ),
    [],
  )
  return texts.map(renderTextItem)
})

const XText = memo(
  ({
    type,
    colors,
    align,
    isEditing,
    text,
    onChangeText,
    zIndex: zIndexProp,
    trashY,
    trashAnim,
  }) => {
    const { bottom } = useSafeAreaInsets()
    const activeTextTrashY = useMemo(
      () => screenHeight / 2 - ResponsiveHeight(70) - bottom / 2,
      [bottom],
    )
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const zIndex = useSharedValue(zIndexProp)
    const textColors =
      type === TextType.Revert ? [Colors.white, Colors.white] : colors
    const containterBgColors =
      type === TextType.WhiteBox
        ? [Colors.white, Colors.white]
        : type === TextType.Revert
        ? colors
        : [Colors.transparent, Colors.transparent]
    const panHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startX = translateX.value
        ctx.startY = translateY.value
        trashY.value = withTiming(1)
      },
      onActive: (event, ctx) => {
        translateX.value = ctx.startX + event.translationX
        translateY.value = ctx.startY + event.translationY
        if (translateY.value >= activeTextTrashY && trashAnim.value === 0) {
          trashAnim.value = withTiming(1)
        } else if (
          translateY.value < activeTextTrashY &&
          trashAnim.value === 1
        ) {
          trashAnim.value = withTiming(0)
        }
      },
      onEnd: () => {
        trashY.value = withTiming(0)
        if (translateY.value >= activeTextTrashY) {
          zIndex.value = -99
          trashAnim.value = withTiming(0)
        }
      },
    })
    const textStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
      zIndex: zIndex.value,
    }))
    return (
      <PanGestureHandler onGestureEvent={panHandler}>
        <Animated.View
          style={[
            textStyle,
            isEditing ? styles.baseTextInputView : styles.baseTextView,
            {
              alignSelf: align,
            },
          ]}
        >
          <RNLinearGradient
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 0,
            }}
            colors={containterBgColors}
            style={styles.textBgView}
          />
          <AppGradientText
            colors={textColors}
            color={Colors.white}
            fontSize={18}
            lineHeight={22}
            fontWeight={800}
            isInput={isEditing}
            {...(isEditing
              ? { onChangeText, autoFocus: true, value: text }
              : { children: text })}
          />
        </Animated.View>
      </PanGestureHandler>
    )
  },
)
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
    skipResponsive: true,
  },
  stickerItem: {
    position: 'absolute',
    alignSelf: 'center',
    top: (screenHeight - (screenWidth / 4) * 0.8) / 2,
    skipResponsive: true,
  },
  drawView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  drawControlView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 102,
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
    zIndex: 101,
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
  toolBar: {
    position: 'absolute',
    zIndex: 99,
    right: 0,
    paddingHorizontal: 16,
  },
  toolBarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black50,
  },
  trashBar: {
    backgroundColor: Colors.black50,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trashBarBg: {
    height: 50,
    width: screenWidth,
    backgroundColor: Colors.error,
    position: 'absolute',
    top: 0,
    zIndex: -1,
    skipResponsive: true,
  },
  closeBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 99,
  },
  textEditor: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 99,
    backgroundColor: Colors.black75,
  },
  baseTextInputView: {
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
  },
  baseTextView: {
    position: 'absolute',
    top: (screenHeight - ResponsiveHeight(40)) / 2,
    skipResponsive: true,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: 'hidden',
    height: ResponsiveHeight(40),
    justifyContent: 'center',
  },
  textBgView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  textHeaderView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  textHeaderBtn: {
    marginHorizontal: 10,
  },
  nextBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 99,
    height: 40,
  },
  headerDrawControlView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 101,
  },
  bottomDrawControlView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 101,
  },
  drawControlBtn: {
    height: 40,
  },
})
