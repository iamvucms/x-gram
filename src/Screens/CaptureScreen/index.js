import {
  CloseSvg,
  FlashOffSvg,
  FlashOnSvg,
  HdrSvg,
  RotateCameraSvg,
} from '@/Assets/Svg'
import { Box, Container, Obx } from '@/Components'
import { useAppTheme } from '@/Hooks'
import { goBack } from '@/Navigators'
import { diaLogStore } from '@/Stores'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { getHitSlop, isAndroid } from '@/Utils'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, TouchableOpacity, View } from 'react-native'
import { PinchGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
const AnimatedCamera = Animated.createAnimatedComponent(Camera)
const CaptureScreen = ({ route }) => {
  const {} = route.params || {}
  const { Images } = useAppTheme()
  const { t } = useTranslation()
  const cameraRef = useRef()
  const devices = useCameraDevices()
  const zoom = useSharedValue(1)
  const state = useLocalObservable(() => ({
    flash: false,
    setFlash: value => (state.flash = value),
    device: devices.back,
    setDevice: value => (state.device = value),
    hdr: false,
    setHdr: value => (state.hdr = value),
  }))
  useEffect(() => {
    const init = async () => {
      const cameraPermission = await Camera.requestCameraPermission()
      if (cameraPermission !== 'authorized') {
        diaLogStore.showDiaLog({
          title: t('capture.camera_permission_title'),
          message: t('capture.camera_permission_description'),
          dialogIcon: Images.pack1_3,
          buttonText: t('capture.go_to_settings'),
          onPress: () => {
            Linking.openSettings()
          },
        })
      }
    }
    init()
  }, [])
  useEffect(() => {
    state.setDevice(devices.back)
  }, [devices])
  const onCapturePress = useCallback(async () => {
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: state.flash ? 'on' : 'off',
      })
      console.log(photo)
    } catch (e) {
      console.log({ onCapturePress: e })
    }
  }, [])
  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startZoom = zoom.value
    },
    onActive: (event, ctx) => {
      const nextZoom = ctx.startZoom * event.scale
      if (nextZoom > (state?.device?.maxZoom || 1) || nextZoom < 1) {
        return
      }
      zoom.value = nextZoom
    },
  })
  const cameraProps = useAnimatedProps(() => ({
    zoom: zoom.value,
  }))
  return (
    <Container disableTop style={styles.rootView}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={Layout.fill}>
          <Obx>
            {() =>
              !!state.device && (
                <AnimatedCamera
                  ref={cameraRef}
                  style={styles.cameraView}
                  device={state.device}
                  isActive={true}
                  photo
                  format={state.device.formats.find(f => f.supportsPhotoHDR)}
                  hdr={state.hdr}
                  animatedProps={cameraProps}
                />
              )
            }
          </Obx>
          <TouchableOpacity
            hitSlop={getHitSlop(16)}
            onPress={goBack}
            style={styles.closeBtn}
          >
            <CloseSvg color={Colors.white} size={32} />
          </TouchableOpacity>
          <View style={styles.captureBtn}>
            <TouchableOpacity onPress={onCapturePress}>
              <Box size={60} backgroundColor={Colors.white} radius={99} />
            </TouchableOpacity>
          </View>
          <View style={styles.sidebarToolView}>
            <TouchableOpacity
              onPress={() => state.setFlash(!state.flash)}
              style={styles.toolBtn}
            >
              <Obx>
                {() =>
                  state.flash ? (
                    <FlashOnSvg color={Colors.white} size={20} />
                  ) : (
                    <FlashOffSvg color={Colors.white} size={20} />
                  )
                }
              </Obx>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                state.setDevice(
                  state?.device?.position === 'back'
                    ? devices.front
                    : devices.back,
                )
              }
              style={styles.toolBtn}
            >
              <RotateCameraSvg color={Colors.white} size={20} />
            </TouchableOpacity>
            <Obx>
              {() => (
                <TouchableOpacity
                  onPress={() => state.setHdr(!state.hdr)}
                  style={[
                    styles.toolBtn,
                    state.hdr && {
                      backgroundColor: Colors.primary,
                    },
                  ]}
                >
                  <HdrSvg color={Colors.white} size={20} />
                </TouchableOpacity>
              )}
            </Obx>
          </View>
        </Animated.View>
      </PinchGestureHandler>
    </Container>
  )
}

export default CaptureScreen

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.black,
    flex: 1,
  },
  cameraView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  captureBtn: {
    position: 'absolute',
    zIndex: 99,
    bottom: 50,
    alignSelf: 'center',
    padding: 6,
    borderColor: Colors.white,
    borderWidth: 4,
    borderRadius: 99,
  },
  closeBtn: {
    position: 'absolute',
    top: isAndroid ? 36 : 50,
    left: 16,
  },
  sidebarToolView: {
    position: 'absolute',
    zIndex: 99,
    right: 16,
    top: isAndroid ? 36 : 50,
  },
  toolBtn: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: Colors.white006,
    marginBottom: 12,
  },
})
