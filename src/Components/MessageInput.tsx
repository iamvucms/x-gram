import { PhotoSvg, SendSvg } from '@/Assets/Svg'
import { AppFonts, Colors, XStyleSheet } from '@/Theme'
import { getHitSlop, isAndroid } from '@/Utils'
import { useLocalObservable } from 'mobx-react-lite'
import React, { forwardRef, Fragment, useCallback } from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { Obx } from '.'
import Box from './Box'

interface MessageInputProps extends TextInputProps {
  onSendPress: (
    message: object | string,
    isImage?: boolean,
    retryId?: string,
  ) => void
}
const MessageInput = forwardRef(
  (
    { onSendPress, ...textInputProps }: MessageInputProps,
    ref: React.ForwardedRef<TextInput>,
  ) => {
    const state = useLocalObservable(() => ({
      comment: '',
      setComment: (comment: string) => (state.comment = comment),
      get isCommentEmpty() {
        return this.comment.trim().length === 0
      },
    }))
    const onImagePickerPress = useCallback(async () => {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      })
      if (response?.assets?.[0]) {
        state.setComment('')
        const url = `data:${response.assets[0].type};base64,${response.assets[0].base64}`
        onSendPress && onSendPress(url, true)
      }
    }, [])
    const onSendMessage = useCallback(() => {
      if (state.isCommentEmpty) return
      onSendPress && onSendPress(state.comment, false)
      state.setComment('')
    }, [onSendPress])
    return (
      <Fragment>
        <View style={styles.separator} />
        <Box
          row
          padding={10}
          radius={99}
          backgroundColor={Colors.border}
          align="center"
          margin={16}
        >
          <TouchableOpacity
            onPress={onImagePickerPress}
            hitSlop={getHitSlop(10)}
            style={styles.photoBtn}
          >
            <PhotoSvg />
          </TouchableOpacity>
          <Obx>
            {() => (
              <TextInput
                style={styles.textInput}
                placeholderTextColor={Colors.placeholder}
                value={state.comment}
                onChangeText={txt => state.setComment(txt)}
                {...textInputProps}
                onEndEditing={onSendMessage}
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
      </Fragment>
    )
  },
)

export default MessageInput

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
