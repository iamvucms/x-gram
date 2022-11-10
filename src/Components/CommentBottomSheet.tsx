import { CommentSvg, HeartSvg } from '@/Assets/Svg'
import { MessageType } from '@/Models'
import { isReactedPost, reactRequest, sendCommentRequest } from '@/Stores'
import { Colors, Layout, screenHeight, XStyleSheet } from '@/Theme'
import { formatAmount, getHitSlop, isIOS } from '@/Utils'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useLocalObservable } from 'mobx-react-lite'
import React, { forwardRef, memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity, View } from 'react-native'
import Animated, { BounceIn } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardSpacer, LoadingIndicator, MessageInput, Obx } from '.'
import AppBottomSheet from './AppBottomSheet'
import AppText from './AppText'
import Box from './Box'
import CommentItem from './CommentItem'
import Padding from './Padding'
import Row from './Row'
interface CommentBottomSheetProps {
  post: any
  onClose: () => void
}
const CommentBottomSheet = forwardRef(
  ({ post, onClose }: CommentBottomSheetProps, ref) => {
    const { t } = useTranslation()
    const state = useLocalObservable(() => ({
      loading: true,
      setLoading: (loading: boolean) => (state.loading = loading),
    }))

    useEffect(() => {
      const to = setTimeout(() => {
        state.setLoading(false)
      }, 1000)
      return () => clearTimeout(to)
    }, [])

    const onSendPress = useCallback(async (message, messageType, retryId) => {
      const isImage = messageType === MessageType.Image
      sendCommentRequest(post.post_id, message, isImage, retryId)
      Keyboard.dismiss()
    }, [])

    const renderCommentItem = useCallback(({ item }) => {
      const onRetry = () =>
        sendCommentRequest(
          post.post_id,
          item.comment,
          item.is_image,
          item.comment_id,
        )
      return <CommentItem onRetry={onRetry} insideBottomSheet comment={item} />
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
              <CommentSvg color={Colors.kC2C2C2} size={18} />
              <Padding left={6} />
              <Obx>
                {() => (
                  <AppText color={Colors.placeholder} fontSize={16}>
                    {formatAmount(post.comments.length)}
                  </AppText>
                )}
              </Obx>
            </Row>
            <TouchableOpacity
              onPress={() =>
                reactRequest(post.post_id, isReactedPost(post.post_id))
              }
              hitSlop={getHitSlop(16)}
            >
              <Obx>
                {() => (
                  <Animated.View entering={BounceIn} key={Math.random()}>
                    <HeartSvg
                      color={
                        isReactedPost(post.post_id)
                          ? Colors.kFB2576
                          : Colors.kC2C2C2
                      }
                      size={20}
                    />
                  </Animated.View>
                )}
              </Obx>
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
                      data={post.comments.slice()}
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
