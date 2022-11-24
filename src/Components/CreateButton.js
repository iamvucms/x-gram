import { PlusCircleSvg } from '@/Assets/Svg'
import { CreateOptions } from '@/Models'
import { navigate } from '@/Navigators'
import { Colors, XStyleSheet } from '@/Theme'
import { Portal } from '@gorhom/portal'
import { Observer, useLocalObservable } from 'mobx-react-lite'
import React, { useRef } from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'
import Animated, {
  BounceIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

const CreateButton = () => {
  const anim = useSharedValue(0)
  const ref = useRef()
  const state = useLocalObservable(() => ({
    isVisible: false,
    specs: null,
    setVisible: (visible, specs = null) => {
      state.isVisible = visible
      state.specs = specs
    },
  }))
  const onPress = React.useCallback(() => {
    ref.current.measure((x, y, width, height, pageX, pageY) => {
      state.setVisible(true, { width, height, pageX, pageY })
      anim.value = withSpring(1)
    })
  }, [])
  const onHide = React.useCallback(callback2 => {
    const callback = () => {
      if (typeof callback2 === 'function') {
        callback2()
      }
      state.setVisible(false)
    }
    anim.value = withTiming(
      0,
      {},
      isFinished => isFinished && runOnJS(callback)(),
    )
  }, [])
  const backdropStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(anim.value, [0, 1], [1, 35]),
      },
    ],
  }))
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotateZ: `${interpolate(anim.value, [0, 1], [0, 45])}deg`,
      },
    ],
  }))
  const renderCaptureItem = (_, index) => {
    return <CaptureItem key={index} index={index} anim={anim} hide={onHide} />
  }
  return (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        ref={ref}
        style={styles.container}
      >
        <View>
          <PlusCircleSvg size={58} />
        </View>
      </TouchableOpacity>
      <Observer>
        {() => {
          return (
            !!state.isVisible && (
              <Portal name="CREATE_MODAL">
                <View style={styles.overlayContainer}>
                  <View
                    style={[
                      state.isVisible && {
                        top: state.specs?.pageY,
                        left: state.specs?.pageX,
                        width: state.specs?.width,
                        height: state.specs?.height,
                      },
                    ]}
                  >
                    <Animated.View style={[styles.backdrop, backdropStyle]}>
                      <Pressable
                        onPress={onHide}
                        style={styles.backdropInner}
                      />
                    </Animated.View>
                    {CreateOptions.map(renderCaptureItem)}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={onHide}
                      style={[styles.container]}
                    >
                      <Animated.View style={buttonStyle}>
                        <PlusCircleSvg size={58} />
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Portal>
            )
          )
        }}
      </Observer>
    </React.Fragment>
  )
}

export default CreateButton
const CaptureItem = React.memo(({ index, anim, hide }) => {
  const captureOption = CreateOptions[index]
  const captureItemStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          anim.value,
          [0, 1],
          [0, index === 1 ? -120 : -80],
        ),
      },
      {
        translateX: interpolate(
          anim.value,
          [0, 1],
          [0, index === 1 ? 0 : (index - 1) * 80],
        ),
      },
    ],
    backgroundColor: captureOption.bgColor,
  }))
  const onPress = React.useCallback(() => {
    const callback = () => {
      navigate(captureOption.routeName, captureOption.params)
    }
    hide(callback)
  }, [])
  return (
    <Animated.View style={[styles.captureItem, captureItemStyle]}>
      <TouchableOpacity onPress={onPress} style={styles.btnCaptureItem}>
        {captureOption.icon}
      </TouchableOpacity>
    </Animated.View>
  )
})
const styles = XStyleSheet.create({
  container: {
    height: 60,
    width: 60,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.white,
    borderWidth: 2,
  },
  overlayContainer: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: -99,
  },
  backdropInner: {
    ...XStyleSheet.absoluteFillObject,
  },
  captureItem: {
    height: 60,
    width: 60,
    backgroundColor: Colors.primary,
    borderColor: Colors.white,
    borderWidth: 2,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1,
    borderRadius: 99,
  },
  btnCaptureItem: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
  },
})
