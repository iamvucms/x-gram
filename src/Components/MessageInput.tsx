import { PhotoSvg, SendSvg, StickerSvg } from '@/Assets/Svg'
import { MessageType } from '@/Models'
import { AppFonts, Colors, XStyleSheet } from '@/Theme'
import { getHitSlop, isAndroid } from '@/Utils'
import { useLocalObservable } from 'mobx-react-lite'
import React, {
  forwardRef,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { Obx, Padding, Row, StickerPickerSheet } from '.'
import Box from './Box'

interface MessageInputProps extends TextInputProps {
  onSendPress: (
    message: object | string,
    messageType?: MessageType,
    retryId?: string,
  ) => void
  edittingMessage?: string
  allowStickers?: boolean
  containerStyle?: ViewStyle
}
const MessageInput = forwardRef(
  (
    {
      onSendPress,
      edittingMessage,
      allowStickers,
      containerStyle,
      ...textInputProps
    }: MessageInputProps,
    ref: React.ForwardedRef<TextInput>,
  ) => {
    const stickerRef = useRef<any>()
    const state = useLocalObservable(() => ({
      message: '',
      setMessage: (message: string) => (state.message = message),
      get isCommentEmpty() {
        return this.message.trim().length === 0
      },
    }))
    useEffect(() => {
      if (typeof edittingMessage === 'string') {
        state.setMessage(edittingMessage)
      }
    }, [edittingMessage])
    const onImagePickerPress = useCallback(async () => {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      })
      if (response?.assets?.[0]) {
        state.setMessage('')
        const url = `data:${response.assets[0].type};base64,${response.assets[0].base64}`
        onSendPress && onSendPress(url, MessageType.Image)
      }
    }, [])
    const onSendMessage = useCallback(() => {
      if (state.isCommentEmpty) return
      onSendPress && onSendPress(state.message, MessageType.Text)
      state.setMessage('')
    }, [onSendPress])
    return (
      <Fragment>
        <View style={styles.separator} />
        <Box
          row
          padding={10}
          radius={99}
          backgroundColor={Colors.white}
          align="center"
          margin={16}
          style={containerStyle}
          borderColor={Colors.border}
          borderWidth={0.5}
        >
          <Row>
            <TouchableOpacity
              onPress={onImagePickerPress}
              hitSlop={getHitSlop(10)}
              style={styles.photoBtn}
            >
              <PhotoSvg color={Colors.primary} />
            </TouchableOpacity>
            {allowStickers && (
              <>
                <Padding left={8} />
                <TouchableOpacity
                  onPress={() => stickerRef.current?.snapTo?.(0)}
                  hitSlop={getHitSlop(10)}
                  style={styles.photoBtn}
                >
                  <StickerSvg color={Colors.primary} />
                </TouchableOpacity>
              </>
            )}
          </Row>
          <Obx>
            {() => (
              <TextInput
                style={styles.textInput}
                placeholderTextColor={Colors.placeholder}
                placeholder="Type a message"
                {...textInputProps}
                value={state.message}
                onChangeText={txt => state.setMessage(txt)}
                onSubmitEditing={onSendMessage}
                ref={ref}
              />
            )}
          </Obx>
          <Obx>
            {() => (
              <TouchableOpacity
                disabled={state.isCommentEmpty}
                onPress={onSendMessage}
                hitSlop={getHitSlop(10)}
                style={styles.photoBtn}
              >
                <SendSvg
                  size={20}
                  color={state.isCommentEmpty ? Colors.black50 : Colors.primary}
                />
              </TouchableOpacity>
            )}
          </Obx>
        </Box>
        {allowStickers && (
          <StickerPickerSheet
            ref={stickerRef}
            onSelectSticker={sticker => {
              onSendPress && onSendPress(sticker, MessageType.Sticker)
              stickerRef.current?.close?.()
            }}
          />
        )}
      </Fragment>
    )
  },
)

export default memo(MessageInput)

const styles = XStyleSheet.create({
  separator: {
    backgroundColor: Colors.border,
    height: 1,
  },
  photoBtn: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 99,
    borderColor: Colors.border,
    borderWidth: 0.5,
  },
  textInput: {
    fontFamily: AppFonts['400'],
    color: Colors.black,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    ...(isAndroid && {
      marginVertical: -15,
    }),
  },
})
