import { Container } from '@/Components'
import { Colors, screenHeight, screenWidth, XStyleSheet } from '@/Theme'
import React, { memo, useCallback, useRef } from 'react'
import { Image, ImageBackground } from 'react-native'
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
  const { type, medias } = route.params || {}
  const viewShotRefs = useRef([]).current
  const renderViewShotPage = useCallback(({ item, index }) => {
    return (
      <ViewShot
        ref={ref => (viewShotRefs[index] = ref)}
        style={styles.viewShot}
      >
        <ImageBackground
          blurRadius={10}
          style={styles.imageBackground}
          source={{
            uri: item.uri,
          }}
        />
        <AnimatedImage image={item} />
      </ViewShot>
    )
  }, [])
  return (
    <Container style={styles.rootView}>
      <FlatList
        pagingEnabled
        data={medias}
        renderItem={renderViewShotPage}
        keyExtractor={item => item.uri}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
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
})
