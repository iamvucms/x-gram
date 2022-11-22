import {
  CameraSvg,
  CloseSvg,
  FlashOffSvg,
  FlashOnSvg,
  HdrSvg,
  PauseSvg,
  PlaySvg,
  RecordSvg,
  RotateCameraSvg,
  UploadSvg,
} from '@/Assets/Svg'
import { AppText, Box, Container, Obx } from '@/Components'
import { PageName } from '@/Config'
import { useAppTheme } from '@/Hooks'
import { goBack, navigate } from '@/Navigators'
import { diaLogStore } from '@/Stores'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { getHitSlop, isAndroid, secondToTime } from '@/Utils'
import { toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, TouchableOpacity, View } from 'react-native'
import { PinchGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  FadeInDown,
  FadeInRight,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Video from 'react-native-video'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
const AnimatedCamera = Animated.createAnimatedComponent(Camera)
const RecordState = {
  IDLE: 0,
  RECORDING: 1,
  PLAYING: 2,
  PAUSED: 3,
}
const CaptureScreen = ({ route }) => {
  const { type, editable, editorProps, disableVideo } = route.params || {}
  const { Images } = useAppTheme()
  const { t } = useTranslation()
  const cameraRef = useRef()
  const devices = useCameraDevices()
  const zoom = useSharedValue(1)
  const switchAnim = useSharedValue(type === 'photo' ? 0 : 1)
  const state = useLocalObservable(() => ({
    flash: false,
    setFlash: value => (state.flash = value),
    device: devices.back,
    setDevice: value => (state.device = value),
    hdr: false,
    setHdr: value => (state.hdr = value),
    video: type !== 'photo',
    setVideo: value => (state.video = value),
    recordState: RecordState.IDLE,
    setRecordState: value => (state.recordState = value),
    recordedVideo: null,
    setRecordedVideo: value => (state.recordedVideo = value),
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
    if (!state.video) {
      try {
        const photo = await cameraRef.current?.takePhoto?.({
          flash: state.flash ? 'on' : 'off',
        })
        const files = [
          {
            ...photo,
            uri: `file://${photo.path}`,
            mimeType: 'image/jpeg',
          },
        ]
        if (editable) {
          navigate(PageName.ImageEditor, {
            medias: files,
            ...editorProps,
          })
        } else {
          editorProps?.onNext?.(files)
        }
      } catch (e) {
        console.log({ onCapturePress: e })
      }
    } else {
      switchAnim.value = withTiming(0)
      state.setVideo(false)
      state.setRecordState(RecordState.IDLE)
      state.setRecordedVideo(null)
    }
  }, [])
  const onRecordPress = useCallback(async () => {
    if (state.video) {
      try {
        switch (state.recordState) {
          case RecordState.IDLE:
            cameraRef.current?.startRecording?.({
              flash: state.flash ? 'on' : 'off',
              onRecordingFinished: video => {
                state.setRecordedVideo(video)
              },
              onRecordingError: error => {
                console.log(error)
              },
            })
            state.setRecordState(RecordState.RECORDING)
            break
          case RecordState.RECORDING:
            await cameraRef.current?.stopRecording?.()
            state.setRecordState(RecordState.PLAYING)
            break
          case RecordState.PAUSED:
            state.setRecordState(RecordState.PLAYING)
            break
          case RecordState.PLAYING:
            state.setRecordState(RecordState.PAUSED)
            break
          default:
            break
        }
      } catch (e) {
        console.log({ onRecordPress: e })
      }
    } else {
      switchAnim.value = withTiming(1)
      state.setVideo(true)
    }
  }, [])
  const onRemovePress = useCallback(() => {
    state.setRecordedVideo(null)
    state.setRecordState(RecordState.IDLE)
  }, [])
  const onVideoDonePress = useCallback(() => {
    if (state.recordedVideo) {
      const files = [
        {
          ...toJS(state.recordedVideo),
          uri: `${state.recordedVideo.path}`,
          mimeType: 'video/mp4',
        },
      ]
      editorProps?.onNext?.(files)
    }
  }, [])
  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startZoom = zoom.value
    },
    onActive: (event, ctx) => {
      const nextZoom = ctx.startZoom * event.scale
      if (nextZoom < 1) {
        return
      }
      zoom.value = nextZoom
    },
  })
  const cameraProps = useAnimatedProps(() => ({
    zoom: zoom.value,
  }))
  const captureBtnStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(switchAnim.value, [0, 1], [1, 0.6]),
      },
      {
        translateX: interpolate(switchAnim.value, [0, 1], [36, -70]),
      },
    ],
  }))
  const recordBtnStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(switchAnim.value, [0, 1], [0.6, 1]),
      },
      {
        translateX: interpolate(switchAnim.value, [0, 1], [70, -36]),
      },
    ],
  }))
  return (
    <Container disableTop style={styles.rootView}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={Layout.fill}>
          <Obx>
            {() =>
              !!state.device && (
                <Obx>
                  {() =>
                    state.recordedVideo ? (
                      <Obx>
                        {() => (
                          <Video
                            source={{
                              uri: state.recordedVideo.path,
                            }}
                            resizeMode="cover"
                            paused={state.recordState === RecordState.PAUSED}
                            style={styles.recordedVideo}
                            onEnd={() =>
                              state.setRecordState(RecordState.PAUSED)
                            }
                          />
                        )}
                      </Obx>
                    ) : (
                      <AnimatedCamera
                        ref={cameraRef}
                        style={styles.cameraView}
                        device={state.device}
                        isActive={true}
                        photo
                        video
                        format={state.device.formats.find(
                          f => f.supportsPhotoHDR,
                        )}
                        hdr={state.hdr}
                        animatedProps={cameraProps}
                      />
                    )
                  }
                </Obx>
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
          <Box row center style={styles.bottomCapture}>
            <Obx>
              {() =>
                !!state.recordedVideo && (
                  <Animated.View
                    style={styles.removeView}
                    entering={FadeInRight}
                  >
                    <TouchableOpacity
                      onPress={onRemovePress}
                      style={styles.removeBtn}
                    >
                      <CloseSvg size={16} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={onVideoDonePress}
                      style={[
                        styles.removeBtn,
                        {
                          backgroundColor: Colors.kB8FF8D,
                        },
                      ]}
                    >
                      <UploadSvg size={16} color={Colors.white} />
                    </TouchableOpacity>
                  </Animated.View>
                )
              }
            </Obx>
            <Obx>
              {() => {
                if (!state.recordedVideo) {
                  return null
                }
                const duration = secondToTime(
                  Math.ceil(state.recordedVideo.duration),
                )
                return (
                  state.recordedVideo && (
                    <Animated.View
                      entering={FadeInDown}
                      style={styles.durationView}
                    >
                      <AppText fontWeight={600} fontSize={12}>
                        {duration.minutes}:{duration.seconds}
                      </AppText>
                    </Animated.View>
                  )
                )
              }}
            </Obx>
            <Animated.View style={[styles.captureBtn, captureBtnStyle]}>
              <TouchableOpacity onPress={onCapturePress}>
                <Box
                  size={60}
                  backgroundColor={Colors.white}
                  radius={99}
                  center
                >
                  <CameraSvg color={Colors.placeholder} solid />
                </Box>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={[
                styles.captureBtn,
                recordBtnStyle,
                // eslint-disable-next-line react-native/no-inline-styles
                disableVideo && {
                  opacity: 0,
                },
              ]}
            >
              <TouchableOpacity disabled={disableVideo} onPress={onRecordPress}>
                <Box
                  center
                  size={60}
                  backgroundColor={Colors.white}
                  radius={99}
                >
                  <Obx>
                    {() =>
                      state.video ? (
                        state.recordState === RecordState.IDLE ? (
                          <Box
                            size={16}
                            radius={99}
                            backgroundColor={Colors.error}
                          />
                        ) : state.recordState === RecordState.RECORDING ? (
                          <Box
                            size={16}
                            radius={4}
                            backgroundColor={Colors.error}
                          />
                        ) : state.recordState === RecordState.PAUSED ? (
                          <PlaySvg color={Colors.kB8FF8D} />
                        ) : (
                          <PauseSvg color={Colors.error} />
                        )
                      ) : (
                        <RecordSvg color={Colors.placeholder} />
                      )
                    }
                  </Obx>
                </Box>
              </TouchableOpacity>
            </Animated.View>
          </Box>
          <View style={styles.sidebarToolView}>
            <Obx>
              {() =>
                state?.device?.hasFlash && (
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
                )
              }
            </Obx>
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
  bottomCapture: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  recordedVideo: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  removeView: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeBtn: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.error,
    borderRadius: 99,
    marginLeft: 16,
  },
  durationView: {
    position: 'absolute',
    top: -36,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
})
