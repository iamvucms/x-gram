import {
  BlockSvg,
  BookMarkSvg,
  BookMarkedSvg,
  EditSvg,
  FollowSvg,
  LinkSvg,
  ProfileSvg,
  ReportSvg,
  TrashBinSvg,
  UnfollowSvg,
} from '@/Assets/Svg'
import { PageName } from '@/Config'
import { Post } from '@/Models'
import { navigate, navigateToProfile } from '@/Navigators'
import { deletePost, diaLogStore, userStore } from '@/Stores'
import { Colors, XStyleSheet, screenHeight } from '@/Theme'
import { isIOS } from '@/Utils'
import Clipboard from '@react-native-clipboard/clipboard'
import { toJS } from 'mobx'
import React, { forwardRef, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity } from 'react-native'
import { AppText, KeyboardSpacer, Obx, Padding } from '.'
import AppBottomSheet from './AppBottomSheet'
import Box from './Box'

interface PostOptionBottomSheetProps {
  index: number
  post: Post
  onClose: () => void
}
const PostOptionBottomSheet = forwardRef(
  ({ onClose, post, index = 0 }: PostOptionBottomSheetProps, ref: any) => {
    const { t } = useTranslation()

    const _onClose = useCallback(() => {
      Keyboard.dismiss()
      onClose && onClose()
    }, [])
    const isMyPost = post?.posted_by.user_id === userStore.userInfo.user_id
    return (
      <AppBottomSheet
        onClose={_onClose}
        index={index}
        snapPoints={[isMyPost ? screenHeight * 0.35 : screenHeight * 0.45]}
        ref={ref}
        backgroundStyle={styles.sheetHeader}
        handleIndicatorStyle={{ backgroundColor: Colors.white50 }}
      >
        <Box
          topLeftRadius={16}
          topRightRadius={16}
          fill
          backgroundColor={Colors.white}
        >
          <Box
            height={50}
            center
            borderBottomWidth={1}
            borderBottomColor={Colors.border}
          >
            <AppText fontSize={16} fontWeight={700}>
              {t('home.post_options')}
            </AppText>
          </Box>
          <Box
            topLeftRadius={24}
            topRightRadius={24}
            fill
            backgroundColor={Colors.white}
            overflow="hidden"
          >
            <Box fill>
              <Box
                radius={4}
                backgroundColor={Colors.white}
                {...(!isMyPost && {
                  borderBottomColor: Colors.border,
                  borderBottomWidth: 0.5,
                })}
              >
                {isMyPost && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        onClose()
                        setTimeout(() => {
                          navigate(PageName.EditPostScreen, {
                            postId: post.post_id,
                          })
                        })
                      }}
                      style={styles.optionBtn}
                    >
                      <EditSvg size={20} />
                      <Padding left={14} />
                      <AppText fontSize={16} fontWeight={500}>
                        {t('home.edit_post')}
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        onClose()
                        diaLogStore.showDiaLog({
                          title: 'home.delete_post',
                          message: 'home.undo_note',
                          dialogIcon: 'pack1_3',
                          showCancelButton: true,
                          onPress: () => deletePost(post.post_id),
                        })
                      }}
                      style={styles.optionBtn}
                    >
                      <TrashBinSvg size={20} />
                      <Padding left={14} />
                      <AppText fontSize={16} fontWeight={500}>
                        {t('home.delete_post')}
                      </AppText>
                    </TouchableOpacity>
                  </>
                )}
                {!isMyPost && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        ref?.close?.()
                      }}
                      style={styles.optionBtn}
                    >
                      <ReportSvg size={20} />
                      <Padding left={14} />
                      <AppText fontSize={16} fontWeight={500}>
                        {t('home.report_post')}
                      </AppText>
                    </TouchableOpacity>
                  </>
                )}

                <Obx>
                  {() => {
                    const isBookMarked = userStore.isBookmarked(post.post_id)
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          isBookMarked
                            ? userStore.removeBookmarkPost(post.post_id)
                            : userStore.addBookmarkPost(toJS(post))
                        }}
                        style={styles.optionBtn}
                      >
                        {isBookMarked ? (
                          <BookMarkedSvg size={20} />
                        ) : (
                          <BookMarkSvg size={20} />
                        )}
                        <Padding left={14} />
                        <AppText fontSize={16} fontWeight={500}>
                          {t(
                            isBookMarked
                              ? 'home.unbookmark_post'
                              : 'home.bookmark_post',
                          )}
                        </AppText>
                      </TouchableOpacity>
                    )
                  }}
                </Obx>

                <TouchableOpacity
                  onPress={() => {
                    onClose()
                    Clipboard.setString('...')
                  }}
                  style={styles.optionBtn}
                >
                  <LinkSvg size={20} />
                  <Padding left={14} />
                  <AppText fontSize={16} fontWeight={500}>
                    {t('home.copy_link')}
                  </AppText>
                </TouchableOpacity>
              </Box>
              {!isMyPost && (
                <Box
                  radius={4}
                  marginBottom={16}
                  backgroundColor={Colors.white}
                >
                  <TouchableOpacity
                    onPress={() => {
                      onClose()
                      setTimeout(() => {
                        navigateToProfile(post.posted_by.user_id)
                      })
                    }}
                    style={styles.optionBtn}
                  >
                    <ProfileSvg size={20} />
                    <Padding left={14} />
                    <AppText fontSize={16} fontWeight={500}>
                      {t('conversations.view_profile')}
                    </AppText>
                  </TouchableOpacity>
                  <Obx>
                    {() => {
                      const isFollowing = userStore.isFollowing(
                        post?.posted_by.user_id,
                      )
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (isFollowing) {
                              userStore.unfollowUser(post?.posted_by)
                            } else {
                              userStore.followUser(post?.posted_by)
                            }
                          }}
                          style={styles.optionBtn}
                        >
                          {isFollowing ? (
                            <UnfollowSvg size={20} />
                          ) : (
                            <FollowSvg size={20} />
                          )}
                          <Padding left={14} />
                          <AppText fontSize={16} fontWeight={500}>
                            {t(
                              isFollowing
                                ? 'home.unfollow_so'
                                : 'home.follow_so',
                              {
                                replace: { so: post?.posted_by?.full_name },
                              },
                            )}
                          </AppText>
                        </TouchableOpacity>
                      )
                    }}
                  </Obx>
                  <TouchableOpacity
                    onPress={() => {
                      onClose()
                      diaLogStore.showDiaLog({
                        title: t('home.block_so', {
                          so: post?.posted_by?.full_name,
                        }),
                        message: t('account.confirm_block'),
                        dialogIcon: 'pack1_3',
                        showCancelButton: true,
                        onPress: () => userStore.blockUser(post.posted_by),
                      })
                    }}
                    style={styles.optionBtn}
                  >
                    <BlockSvg size={20} />
                    <Padding left={14} />
                    <AppText fontSize={16} fontWeight={500}>
                      {t('home.block_so', {
                        replace: { so: post?.posted_by?.full_name },
                      })}
                    </AppText>
                  </TouchableOpacity>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {isIOS && <KeyboardSpacer />}
      </AppBottomSheet>
    )
  },
)

export default memo(PostOptionBottomSheet)

const styles = XStyleSheet.create({
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1.41,

    elevation: 2,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sheetHeader: {
    opacity: 0,
  },
})
