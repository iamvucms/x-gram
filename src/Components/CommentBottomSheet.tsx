import { CommentSvg, HeartSvg, PhotoSvg, SendSvg } from '@/Assets/Svg'
import { AppFonts, Colors, Layout, screenHeight, XStyleSheet } from '@/Theme'
import { formatAmount, getHitSlop, isAndroid } from '@/Utils'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useLocalObservable } from 'mobx-react-lite'
import React, { forwardRef, memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TextInput, TouchableOpacity, View } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { LoadingIndicator, Obx } from '.'
import AppBottomSheet from './AppBottomSheet'
import AppText from './AppText'
import Box from './Box'
import CommentItem from './CommentItem'
import Padding from './Padding'
import Row from './Row'
interface CommentBottomSheetProps {
  data: any
  postId: string
  onClose: () => void
}
const CommentBottomSheet = forwardRef(
  ({ data, onClose }: CommentBottomSheetProps, ref) => {
    const { t } = useTranslation()
    const state = useLocalObservable(() => ({
      comment: '',
      setComment: (comment: string) => (state.comment = comment),
      loading: true,
      setLoading: (loading: boolean) => (state.loading = loading),
      get isCommentEmpty() {
        return this.comment.trim().length === 0
      },
    }))

    useEffect(() => {
      const to = setTimeout(() => {
        state.setLoading(false)
      }, 1000)
      return () => clearTimeout(to)
    }, [])
    const onImagePickerPress = useCallback(async () => {
      const response = await launchImageLibrary({
        mediaType: 'photo',
      })
      if (response?.assets?.[0]) {
      }
    }, [])

    const onSendPress = useCallback(() => {}, [])

    const renderCommentItem = useCallback(({ item }) => {
      return <CommentItem comment={item} />
    }, [])

    const _onClose = useCallback(() => {
      Keyboard.dismiss()
      onClose && onClose()
    }, [])
    return (
      <AppBottomSheet
        onClose={_onClose}
        index={0}
        snapPoints={[screenHeight - 100]}
      >
        <View style={Layout.fill}>
          <Box
            row
            align="center"
            justify="space-between"
            paddingHorizontal={16}
            paddingVertical={10}
            style={styles.headerView}
          >
            <Row align="center">
              <CommentSvg color={Colors.placeholder} size={18} />
              <Padding left={6} />
              <Obx>
                {() => (
                  <AppText fontSize={16}>
                    {formatAmount(data.comments.length)}
                  </AppText>
                )}
              </Obx>
            </Row>
            <TouchableOpacity hitSlop={getHitSlop(16)}>
              <HeartSvg color={Colors.kC2C2C2} size={20} />
            </TouchableOpacity>
          </Box>
          <Obx>
            {() =>
              state.loading ? (
                <Box center fill>
                  <LoadingIndicator type="Circle" />
                </Box>
              ) : (
                <Obx>
                  {() => (
                    <BottomSheetFlatList
                      data={data.comments.slice()}
                      renderItem={renderCommentItem}
                      keyExtractor={item => item.id}
                    />
                  )}
                </Obx>
              )
            }
          </Obx>

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
                  placeholderTextColor={Colors.placeholder}
                  placeholder={t('home.comment_placeholder')}
                  value={state.comment}
                  onChangeText={txt => state.setComment(txt)}
                  style={styles.textInput}
                />
              )}
            </Obx>
            <Obx>
              {() => (
                <TouchableOpacity
                  disabled={state.isCommentEmpty}
                  onPress={onSendPress}
                  hitSlop={getHitSlop(10)}
                  style={styles.photoBtn}
                >
                  <SendSvg
                    size={20}
                    color={
                      state.isCommentEmpty ? Colors.black50 : Colors.primary
                    }
                  />
                </TouchableOpacity>
              )}
            </Obx>
          </Box>
        </View>
      </AppBottomSheet>
    )
  },
)

export default memo(CommentBottomSheet)

const styles = XStyleSheet.create({
  headerView: {
    borderBottomWidth: 0.6,
    borderColor: Colors.border,
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
    ...(isAndroid && {
      marginVertical: -15,
    }),
  },
})
