import { navigateToProfile } from '@/Navigators'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { useBottomSheet } from '@gorhom/bottom-sheet'
import React, { useCallback } from 'react'
import { Pressable } from 'react-native'
import AppImage from './AppImage'
import AppText from './AppText'
import Box from './Box'
import Padding from './Padding'
interface CommentItemProps {
  comment: any
  onRequestClose?: () => void
}
const CommentItem = ({ comment }: CommentItemProps) => {
  const sheet = useBottomSheet()
  const onMentionPress = useCallback(user_id => {
    sheet.close()
    navigateToProfile(user_id)
  }, [])
  return (
    <Pressable>
      <Box paddingHorizontal={16} marginTop={20} row>
        <AppImage
          source={{
            uri: comment.commented_by.avatar_url,
          }}
          containerStyle={styles.avatarView}
        />
        <Padding left={14} />
        <Box fill paddingTop={3}>
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
            12h ago
          </AppText>
        </Box>
      </Box>
    </Pressable>
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
