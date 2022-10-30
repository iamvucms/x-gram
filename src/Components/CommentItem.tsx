import { navigateToProfile } from '@/Navigators'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { useBottomSheet } from '@gorhom/bottom-sheet'
import moment from 'moment'
import React, { useCallback } from 'react'
import { Pressable, TouchableOpacity } from 'react-native'
import AppImage from './AppImage'
import AppText from './AppText'
import Box from './Box'
import Padding from './Padding'
interface CommentItemProps {
  comment: any
  insideBottomSheet?: boolean
  onRequestClose?: () => void
  onShowOptions?: () => void
}
const CommentItem = ({
  comment,
  onShowOptions,
  insideBottomSheet = false,
}: CommentItemProps) => {
  const sheet = insideBottomSheet ? useBottomSheet() : { close: () => {} }
  const onMentionPress = useCallback(userId => {
    sheet.close()
    navigateToProfile(userId)
  }, [])
  const Touchable = insideBottomSheet ? Pressable : TouchableOpacity
  return (
    <Touchable onLongPress={onShowOptions}>
      <Box paddingHorizontal={16} marginTop={20} row>
        <AppImage
          source={{
            uri: comment.commented_by.avatar_url,
          }}
          containerStyle={styles.avatarView}
        />
        <Padding left={14} />
        <Box fill>
          <AppText style={Layout.fill} fontWeight={700}>
            {comment.commented_by.full_name}{' '}
            <AppText
              regexMetion
              onMentionPress={onMentionPress}
              color={Colors.black75}
            >
              {comment.comment}
            </AppText>
          </AppText>
          <Padding top={3} />
          <AppText fontSize={12} color={Colors.black50}>
            {moment(comment.created_at).fromNow()}
          </AppText>
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
})
