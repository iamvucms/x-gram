import { CameraSvg, CheckSvg, CloseSvg, VideoSvg } from '@/Assets/Svg'
import { AppBar, AppText, Container, Obx } from '@/Components'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { Colors, ResponsiveHeight, screenWidth, XStyleSheet } from '@/Theme'
import { isAndroid } from '@/Utils'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { FlashList } from '@shopify/flash-list'
import { toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, PermissionsAndroid, TouchableOpacity, View } from 'react-native'

const MediaPicker = ({ route }) => {
  const {
    type = 'photo',
    onNext = () => {},
    multiple = true,
    editable,
    editorProps = {},
  } = route.params || {}
  const isPickingPhoto = type === 'photo'
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    medias: [],
    fetching: false,
    nextPageCursor: '',
    toggleSelect: uri => {
      const media = state.medias.find(m => m.image.uri === uri)
      if (media) {
        media.selected = !media.selected
      }
    },
    setMedias: medias => {
      state.medias = medias
    },
    setFetching: value => {
      state.fetching = value
    },
    get allowNext() {
      return state.medias.some(media => media.selected)
    },
    get selectedLength() {
      return state.medias.filter(media => media.selected).length
    },
    get selectedMedias() {
      return state.medias.filter(media => media.selected)
    },
  }))
  useEffect(() => {
    state.setFetching(true)
    const init = async () => {
      if (isAndroid) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        )
      }
      CameraRoll.getPhotos({
        assetType: isPickingPhoto ? 'Photos' : 'Videos',
        first: 9999999,
      })
        .then(data => {
          const medias = data.edges.map(edge => {
            const extension = edge.node.image.uri.split('.').pop()
            const isVideo = edge.node.type.includes('video')
            const mimeType = isVideo
              ? `video/${extension}`
              : `image/${extension === 'jpg' ? 'jpeg' : extension}`
            return {
              ...edge.node,
              mimeType,
            }
          })
          state.setFetching(false)
          state.setMedias(medias)
        })
        .catch(err => {
          state.setFetching(false)
          console.log(err)
        })
    }
    init()
  }, [])

  const onCapturePress = useCallback(() => {
    navigate(PageName.CaptureScreen, {
      type,
      onNext,
      multiple,
    })
  }, [])

  const onNextPress = React.useCallback(async () => {
    if (!state.allowNext) {
      return
    }
    const files = toJS(state.selectedMedias).map(media => ({
      ...media,
      uri: media.image.uri,
      mimeType: media.mimeType,
    }))
    if (editable) {
      navigate(PageName.ImageEditor, {
        medias: files,
        ...editorProps,
      })
    } else {
      onNext(files)
    }
  }, [])
  const renderMediaItem = React.useCallback(
    ({ item }) => {
      const isVideo = item.type.includes('video')
      const onPress = () => {
        if (multiple) {
          state.toggleSelect(item.image.uri)
        } else {
          onNext &&
            onNext([{ ...item, uri: item.image.uri, mimeType: item.mimeType }])
        }
      }
      return (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={[styles.mediaItem]}
        >
          <Image
            style={styles.mediaPreviewImage}
            source={{
              uri: item.image.uri,
            }}
          />
          {isVideo && (
            <View style={styles.videoLabel}>
              <VideoSvg size={12} />
            </View>
          )}
          {multiple && (
            <Obx>
              {() => (
                <View
                  style={[
                    styles.checkbox,
                    item.selected && {
                      backgroundColor: Colors.primary,
                    },
                  ]}
                >
                  {item.selected && <CheckSvg size={10} color={Colors.white} />}
                </View>
              )}
            </Obx>
          )}
        </TouchableOpacity>
      )
    },
    [multiple],
  )
  const mediaKeyExtractor = React.useCallback(item => `${item.image.uri}`, [])
  return (
    <Container
      statusBarProps={{
        barStyle: 'light-content',
      }}
      disableTop={false}
    >
      <AppBar
        leftIcon={<CloseSvg color={Colors.white} />}
        title={t(
          isPickingPhoto
            ? 'mediaPicker.select_photo'
            : 'mediaPicker.select_video',
        )}
        titleColor={Colors.white}
        rightComponent={
          multiple && (
            <Obx>
              {() => (
                <AppText
                  color={state.allowNext ? Colors.white : Colors.white50}
                  fontSize={16}
                  fontWeight="700"
                >
                  {t('next')}
                </AppText>
              )}
            </Obx>
          )
        }
        onRightPress={onNextPress}
      />
      <View style={styles.container}>
        <Obx>
          {() => (
            <FlashList
              data={state.medias.slice()}
              renderItem={renderMediaItem}
              keyExtractor={mediaKeyExtractor}
              numColumns={3}
              estimatedItemSize={screenWidth / 3}
            />
          )}
        </Obx>
      </View>
      <TouchableOpacity onPress={onCapturePress} style={styles.captureBtn}>
        <CameraSvg color={Colors.white} />
      </TouchableOpacity>
    </Container>
  )
}

export default MediaPicker

const styles = XStyleSheet.create({
  container: {
    flex: 1,
    marginVertical: -1,
  },
  mediaItem: {
    width: screenWidth / 3,
    aspectRatio: 1,
    skipResponsive: true,
    borderWidth: ResponsiveHeight(1),
  },
  mediaPreviewImage: {
    width: '100%',
    height: '100%',
  },
  videoLabel: {
    position: 'absolute',
    backgroundColor: Colors.white50,
    padding: 5,
    right: 5,
    top: 5,
    borderRadius: 5,
  },
  bottomButtonContainer: {
    height: 44,
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
  },
  btnUpload: {
    height: 44,
    width: '100%',
    borderRadius: 5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    position: 'absolute',
    zIndex: 1,
    height: 24,
    width: 24,
    borderRadius: 99,
    borderColor: Colors.white,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    right: 10,
  },
  captureBtn: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary,
  },
})
