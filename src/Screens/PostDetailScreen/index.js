import {
  CopySvg,
  EyeOffSvg,
  RemoveSvg,
  ReportSvg,
  TrashBinSvg,
} from '@/Assets/Svg'
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
  ShareBottomSheet,
} from '@/Components'
import { MessageType, ShareType } from '@/Models'
import {
  findPostById,
  homeStore,
  sendCommentRequest,
  deleteCommentRequest,
  userStore,
  updateCommentRequest,
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
  const optionSheetRef = useRef()
  const listRef = useRef()
  const state = useLocalObservable(() => ({
    post: null,
    loading: true,
    selectedComment: null,
    editing: false,
    openShare: false,
    setPost: post => (state.post = post),
    setLoading: loading => (state.loading = loading),
    setSelectedComment: comment => (state.selectedComment = comment),
    setEditing: editing => (state.editing = editing),
    setOpenShare: openShare => (state.openShare = openShare),
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

  const onSendPress = useCallback((message, messageType, retryId) => {
    const isImage = MessageType.Image === messageType
    sendCommentRequest(postId, message, isImage, retryId)
    Keyboard.dismiss()
  }, [])
  const onUpdatePress = useCallback(message => {
    state.setEditing(false)
    if (message.trim() === '') {
      return
    }
    const { comment_id: commentId } = state.selectedComment
    updateCommentRequest(postId, commentId, message)
    Keyboard.dismiss()
    state.setSelectedComment(null)
  }, [])
  const onDeleteCommentPress = useCallback(comment => {
    deleteCommentRequest(postId, comment.comment_id, toJS(comment))
    optionSheetRef.current?.close?.()
  }, [])
  const renderCommentItem = useCallback(({ item }) => {
    const onShowOptions = () => {
      state.setSelectedComment(item)
      optionSheetRef.current.snapTo(0)
    }
    const onRetry = () =>
      sendCommentRequest(postId, item.comment, item.is_image, item.comment_id)
    const onRetryUpdate = () =>
      updateCommentRequest(postId, item.comment_id, item.comment)
    return (
      <CommentItem
        onRetry={onRetry}
        onRetryUpdate={onRetryUpdate}
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
              <PostItem
                onCommentPress={() => {
                  listRef.current?.scrollToIndex?.({ index: 0, animated: true })
                }}
                onSharePress={() => state.setOpenShare(true)}
                showDetail
                post={state.post}
              />
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
                  ref={listRef}
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
      <Obx>
        {() => (
          <MessageInput
            edittingMessage={
              state.editing ? state.selectedComment.comment : null
            }
            placeholder={t('home.comment_placeholder')}
            onSendPress={state.editing ? onUpdatePress : onSendPress}
          />
        )}
      </Obx>
      {isIOS && <KeyboardSpacer />}
      <AppBottomSheet
        backgroundStyle={styles.sheetHeader}
        ref={optionSheetRef}
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
            <Obx>
              {() =>
                state.selectedComment &&
                userStore.userInfo.user_id !==
                  state.selectedComment.commented_by.user_id && (
                  <TouchableOpacity
                    onPress={() => {
                      optionSheetRef.current?.close?.()
                      userStore.isHiddenComment(
                        state.selectedComment.comment_id,
                      )
                        ? userStore.removeHiddenComment(
                            state.selectedComment.comment_id,
                          )
                        : userStore.addHiddenComment(
                            state.selectedComment.comment_id,
                          )
                    }}
                    style={styles.optionBtn}
                  >
                    <EyeOffSvg size={20} />
                    <Padding left={14} />
                    <AppText fontSize={16} fontWeight={500}>
                      <Obx>
                        {() =>
                          userStore.isHiddenComment(
                            state.selectedComment.comment_id,
                          )
                            ? t('home.unhide_comment')
                            : t('home.hide_comment')
                        }
                      </Obx>
                    </AppText>
                  </TouchableOpacity>
                )
              }
            </Obx>
            <Obx>
              {() =>
                state.selectedComment &&
                userStore.userInfo.user_id ===
                  state.selectedComment.commented_by.user_id && (
                  <>
                    {!state.selectedComment.is_image && (
                      <TouchableOpacity
                        onPress={() => {
                          state.setEditing(true)
                          optionSheetRef.current?.close?.()
                        }}
                        style={styles.optionBtn}
                      >
                        <RemoveSvg size={20} />
                        <Padding left={14} />
                        <AppText fontSize={16} fontWeight={500}>
                          {t('home.edit_comment')}
                        </AppText>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() =>
                        onDeleteCommentPress(state.selectedComment)
                      }
                      style={styles.optionBtn}
                    >
                      <TrashBinSvg size={20} />
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
      <Obx>
        {() =>
          !!state.post &&
          state.openShare && (
            <ShareBottomSheet
              type={ShareType.Post}
              data={state.post}
              onClose={() => state.setOpenShare(false)}
            />
          )
        }
      </Obx>
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
  sheetHeader: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderBottomWidth: 0,
    marginHorizontal: -0.5,
  },
})
