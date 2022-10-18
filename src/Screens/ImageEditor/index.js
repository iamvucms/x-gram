import { AppBottomSheet, AppButton, Container, Obx } from '@/Components'
import { useAppTheme } from '@/Hooks'
import { getStickerPacks } from '@/Models'
import { Colors, Layout, screenHeight, screenWidth, XStyleSheet } from '@/Theme'
import { generateRandomIntegerInRange } from '@/Utils'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { BlurView } from '@react-native-community/blur'
import { useLocalObservable } from 'mobx-react-lite'
import React, { Fragment, memo, useCallback, useMemo, useRef } from 'react'
import { Image, ImageBackground, TouchableOpacity } from 'react-native'
import {
  FlatList,
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
} from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
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
    packId: 1,
    stickers: medias.map(() => []),
    setIndex: value => (state.index = value),
    setBlur: value => (state.backgroundBlurs[state.index] = value),
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
        <AnimatedImage image={item} />
      </ViewShot>
    )
  }, [])

  const renderStickerItem = useCallback(({ item }) => {
    const onPress = () => {
      state.addSticker(item)
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
        text="Blur"
        onPress={() => {
          sheetRef.current?.snapTo(0)
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

const AnimatedImage = memo(({ image }) => {
  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const rotation = useSharedValue(0)
  const panRef = useRef(null)
  const pinchRef = useRef(null)
  const rotationRef = useRef(null)
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
  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={[panRef, rotationRef]}
      onGestureEvent={pinchHandler}
      minPointers={2}
    >
      <Animated.View style={styles.animatedImgView}>
        <PanGestureHandler
          ref={panRef}
          minPointers={2}
          onGestureEvent={panHandler}
          simultaneousHandlers={[pinchRef, rotationRef]}
        >
          <Animated.View style={styles.animatedImgView}>
            <RotationGestureHandler
              ref={rotationRef}
              minPointers={2}
              onGestureEvent={rotationHandler}
            >
              <Animated.View style={[styles.animatedImgView, animatedStyle]}>
                <Image
                  style={styles.imageView}
                  resizeMode="contain"
                  source={{ uri: image.uri }}
                />
              </Animated.View>
            </RotationGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
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
  animatedImgView: {
    flex: 1,
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
})
