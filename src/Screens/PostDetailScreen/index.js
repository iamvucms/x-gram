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
import { mockPosts } from '@/Models'
import { findPostById, homeStore } from '@/Stores'
import { Colors, screenHeight, XStyleSheet } from '@/Theme'
import { isIOS } from '@/Utils'
import { FlashList } from '@shopify/flash-list'
import { autorun, flowResult, runInAction } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PostDetailScreen = ({ route }) => {
  const { postId } = route.params
  const { t } = useTranslation()
  const sheetRef = useRef()
  const state = useLocalObservable(() => ({
    post: mockPosts[0],
    loading: false,
    comment: '',
    selectedComment: null,
    setPost: post => (state.post = post),
    setLoading: loading => (state.loading = loading),
    setComment: comment => (state.comment = comment),
    setSelectedComment: comment => (state.selectedComment = comment),
    get isCommentEmpty() {
      return this.comment.trim().length === 0
    },
  }))
  useEffect(() => {
    const dispose = autorun(() => {
      runInAction(async () => {
        state.setLoading(true)
        const post = findPostById(postId)
        if (post) {
          state.setPost(post)
          await new Promise(resolve => setTimeout(resolve, 1000))
        } else {
          await flowResult(homeStore.fetchAndAddAdditionalPosts(postId))
        }
        state.setLoading(false)
      })
    })
    return () => dispose()
  }, [])
  const renderCommentItem = useCallback(({ item }) => {
    const onShowOptions = () => {
      state.setSelectedComment(item)
      sheetRef.current.snapTo(0)
    }
    return <CommentItem onShowOptions={onShowOptions} comment={item} />
  }, [])
  const ListHeaderComponent = useMemo(
    () => (
      <Fragment>
        <PostItem showDetail post={state.post} />
        <View style={styles.separator} />
        <Padding horizontal={16}>
          <AppText fontWeight={800}>
            {t('home.comments')} ({state.post.comments.length})
          </AppText>
        </Padding>
      </Fragment>
    ),
    [],
  )

  const onSendPress = useCallback((message, isImage) => {
    console.log({ message, isImage })
  }, [])

  const { bottom } = useSafeAreaInsets()
  return (
    <Container disableTop={false}>
      <AppBar title={t('home.post')} />
      <Obx>
        {() =>
          state.loading ? (
            <Box fill center>
              <LoadingIndicator />
            </Box>
          ) : (
            <Fragment>
              <Obx>
                {() => (
                  <FlashList
                    ListHeaderComponent={ListHeaderComponent}
                    data={state.post.comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.comment_id}
                    showsVerticalScrollIndicator={false}
                    estimatedItemSize={80}
                  />
                )}
              </Obx>
            </Fragment>
          )
        }
      </Obx>
      <MessageInput
        placeholder={t('home.comment_placeholder')}
        onSendPress={onSendPress}
      />
      {isIOS && <KeyboardSpacer />}
      <AppBottomSheet
        ref={sheetRef}
        snapPoints={[screenHeight * 0.5]}
      ></AppBottomSheet>
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
})
