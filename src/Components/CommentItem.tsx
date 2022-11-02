import { CommentStatus } from '@/Models'
import { navigateToProfile } from '@/Navigators'
import { Colors, XStyleSheet } from '@/Theme'
import { useBottomSheet } from '@gorhom/bottom-sheet'
import moment from 'moment'
import React, { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TouchableOpacity, View } from 'react-native'
import { Obx } from '.'
import AppImage from './AppImage'
import AppText from './AppText'
import Box from './Box'
import Padding from './Padding'
interface CommentItemProps {
  comment: any
  insideBottomSheet?: boolean
  onShowOptions?: () => void
  onRetry?: () => void
}
const CommentItem = ({
  comment,
  onShowOptions,
  insideBottomSheet = false,
  onRetry,
}: CommentItemProps) => {
  const { t } = useTranslation()
  const sheet = insideBottomSheet ? useBottomSheet() : { close: () => {} }
  const onMentionPress = useCallback(userId => {
    sheet.close()
    navigateToProfile(userId)
  }, [])

  const Touchable = insideBottomSheet ? Pressable : TouchableOpacity
  return (
    <Touchable
      activeOpacity={0.8}
      onPress={() =>
        comment.status === CommentStatus.ERROR && !!onRetry && onRetry()
      }
      onLongPress={onShowOptions}
    >
      <Box paddingHorizontal={16} marginTop={20} row>
        <AppImage
          source={{
            uri: comment.commented_by.avatar_url,
          }}
          containerStyle={styles.avatarView}
        />
        <Padding left={14} />
        <Box fill>
          <AppText fontWeight={700}>
            {comment.commented_by.full_name}{' '}
            {!comment.is_image && (
              <AppText
                regexMetion
                onMentionPress={onMentionPress}
                color={Colors.black75}
              >
                {comment.comment}
              </AppText>
            )}
          </AppText>
          <Padding top={3} />
          <View>
            {comment.is_image && (
              <Fragment>
                <AppImage
                  onPress={() =>
                    comment.status === CommentStatus.ERROR &&
                    !!onRetry &&
                    onRetry()
                  }
                  containerStyle={styles.image}
                  source={{
                    uri: comment.comment,
                  }}
                />
                <Padding top={3} />
              </Fragment>
            )}
            <Obx>
              {() => (
                <>
                  <AppText
                    fontSize={12}
                    color={
                      comment.status === CommentStatus.ERROR
                        ? Colors.error
                        : Colors.black50
                    }
                  >
                    {comment.status === CommentStatus.SENDING
                      ? t('sending')
                      : comment.status === CommentStatus.UPDATING
                      ? t('updating')
                      : comment.status === CommentStatus.ERROR
                      ? t('wrong')
                      : moment(comment.created_at).fromNow()}
                  </AppText>
                </>
              )}
            </Obx>
          </View>
        </Box>
      </Box>
    </Touchable>
  )
}

export default CommentItem

const styles = XStyleSheet.create({
  avatarView: {
    height: 46,
    width: 46,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
})
