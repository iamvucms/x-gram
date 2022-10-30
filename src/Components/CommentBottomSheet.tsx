import { CommentSvg, HeartSvg } from '@/Assets/Svg'
import { Colors, Layout, screenHeight, XStyleSheet } from '@/Theme'
import { formatAmount, getHitSlop, isIOS } from '@/Utils'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useLocalObservable } from 'mobx-react-lite'
import React, { forwardRef, memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardSpacer, LoadingIndicator, MessageInput, Obx } from '.'
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

    const onSendPress = useCallback((message, isImage) => {}, [])

    const renderCommentItem = useCallback(({ item }) => {
      return <CommentItem insideBottomSheet comment={item} />
    }, [])

    const _onClose = useCallback(() => {
      Keyboard.dismiss()
      onClose && onClose()
    }, [])
    const { bottom } = useSafeAreaInsets()
    return (
      <AppBottomSheet
        onClose={_onClose}
        index={0}
        snapPoints={[screenHeight - 100]}
      >
        <View style={[Layout.fill, { paddingBottom: bottom }]}>
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
                  <LoadingIndicator />
                </Box>
              ) : (
                <Obx>
                  {() => (
                    <BottomSheetFlatList
                      data={data.comments.slice()}
                      renderItem={renderCommentItem}
                      keyExtractor={item => item.comment_id}
                    />
                  )}
                </Obx>
              )
            }
          </Obx>

          <MessageInput
            placeholder={t('home.comment_placeholder')}
            onSendPress={onSendPress}
          />
        </View>
        {isIOS && <KeyboardSpacer topSpacing={bottom > 16 ? -bottom : 0} />}
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
})
