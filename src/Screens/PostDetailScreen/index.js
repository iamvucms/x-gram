import { CopySvg, EyeOffSvg, RemoveSvg, ReportSvg } from '@/Assets/Svg'
import {
  AppBar,
  AppBottomSheet,
  AppText,
  Box,
  CommentItem,
  Container,
  KeyboardSpacer,
  LoadingIndicator,
  MessageInput,
  Obx,
  Padding,
  PostItem,
} from '@/Components'
import {
  findPostById,
  homeStore,
  sendCommentRequest,
  deleteCommentRequest,
  userStore,
} from '@/Stores'
import { Colors, screenHeight, XStyleSheet } from '@/Theme'
import { isIOS } from '@/Utils'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import Clipboard from '@react-native-clipboard/clipboard'
import { FlashList } from '@shopify/flash-list'
import { autorun, flowResult, runInAction, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity, View } from 'react-native'

const PostDetailScreen = ({ route }) => {
  const { postId } = route.params
  const { t } = useTranslation()
  const sheetRef = useRef()
  const state = useLocalObservable(() => ({
    post: null,
    loading: true,
    selectedComment: null,
    editing: false,
    setPost: post => (state.post = post),
    setLoading: loading => (state.loading = loading),
    setSelectedComment: comment => (state.selectedComment = comment),
    setEditing: editing => (state.editing = editing),
  }))
  useEffect(() => {
    const dispose = autorun(() => {
      runInAction(async () => {
        const post = findPostById(postId)
        if (post) {
          state.setPost(post)
        } else {
          await flowResult(homeStore.fetchAndAddAdditionalPosts(postId))
        }
        state.setLoading(false)
      })
    })
    return () => dispose()
  }, [])

  const onSendPress = useCallback((message, isImage, retryId) => {
    sendCommentRequest(postId, message, isImage, retryId)
    Keyboard.dismiss()
  }, [])
  const onDeleteCommentPress = useCallback(comment => {
    deleteCommentRequest(postId, comment.comment_id, toJS(comment))
    sheetRef.current?.close?.()
  }, [])
  const renderCommentItem = useCallback(({ item }) => {
    const onShowOptions = () => {
      state.setSelectedComment(item)
      sheetRef.current.snapTo(0)
    }
    const onRetry = () =>
      sendCommentRequest(postId, item.comment, item.is_image, item.comment_id)
    return (
      <CommentItem
        onRetry={onRetry}
        onShowOptions={onShowOptions}
        comment={item}
      />
    )
  }, [])
  const ListHeaderComponent = useMemo(
    () => (
      <Obx>
        {() =>
          !state.loading && (
            <Fragment>
              <PostItem showDetail post={state.post} />
              <View style={styles.separator} />
              <Padding horizontal={16}>
                <AppText fontWeight={800}>
                  {t('home.comments')} ({state.post.comments.length})
                </AppText>
              </Padding>
            </Fragment>
          )
        }
      </Obx>
    ),
    [],
  )
  return (
    <Container style={styles.rootView} disableTop={false}>
      <AppBar title={t('home.post')} />
      <Obx>
        {() =>
          state.loading ? (
            <Box fill center>
              <LoadingIndicator />
            </Box>
          ) : (
            <Obx>
              {() => (
                <FlashList
                  ListHeaderComponent={ListHeaderComponent}
                  data={state.post.comments.slice()}
                  renderItem={renderCommentItem}
                  keyExtractor={item => item.comment_id}
                  showsVerticalScrollIndicator={false}
                  estimatedItemSize={80}
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

      {isIOS && <KeyboardSpacer />}
      <AppBottomSheet
        backgroundStyle={{ backgroundColor: Colors.transparent }}
        ref={sheetRef}
        snapPoints={[screenHeight * 0.5]}
      >
        <Box
          fill
          backgroundColor={Colors.white}
          topLeftRadius={20}
          topRightRadius={20}
        >
          <Box
            paddingVertical={16}
            center
            borderBottomWidth={0.5}
            borderBottomColor={Colors.border}
          >
            <AppText fontSize={16} fontWeight={700}>
              {t('home.comment_options')}
            </AppText>
          </Box>

          <BottomSheetScrollView>
            <Obx>
              {() =>
                state.selectedComment && (
                  <Box
                    radius={16}
                    borderWidth={1}
                    borderColor={Colors.primary}
                    margin={16}
                    backgroundColor={Colors.primary05}
                    paddingBottom={12}
                  >
                    <CommentItem
                      insideBottomSheet
                      comment={state.selectedComment}
                    />
                  </Box>
                )
              }
            </Obx>
            <TouchableOpacity style={styles.optionBtn}>
              <EyeOffSvg size={20} />
              <Padding left={14} />
              <AppText fontSize={16} fontWeight={500}>
                {t('home.hide_comment')}
              </AppText>
            </TouchableOpacity>
            <Obx>
              {() =>
                state.selectedComment &&
                userStore.userInfo.user_id ===
                  state.selectedComment.commented_by.user_id && (
                  <>
                    <TouchableOpacity style={styles.optionBtn}>
                      <RemoveSvg size={20} />
                      <Padding left={14} />
                      <AppText fontSize={16} fontWeight={500}>
                        {t('home.edit_comment')}
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        onDeleteCommentPress(state.selectedComment)
                      }
                      style={styles.optionBtn}
                    >
                      <RemoveSvg size={20} />
                      <Padding left={14} />
                      <AppText fontSize={16} fontWeight={500}>
                        {t('home.remove_comment')}
                      </AppText>
                    </TouchableOpacity>
                  </>
                )
              }
            </Obx>
            <TouchableOpacity
              onPress={() => Clipboard.setString(state.selectedComment.comment)}
              style={styles.optionBtn}
            >
              <CopySvg size={20} />
              <Padding left={14} />
              <AppText fontSize={16} fontWeight={500}>
                {t('home.copy_comment')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn}>
              <ReportSvg size={20} />
              <Padding left={14} />
              <AppText fontSize={16} fontWeight={500}>
                {t('home.report_comment')}
              </AppText>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </Box>
      </AppBottomSheet>
    </Container>
  )
}

export default PostDetailScreen

const styles = XStyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  rootView: {
    backgroundColor: Colors.white,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})
