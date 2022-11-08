import { ChevronRightSvg, DotsSvg, ReportSvg } from '@/Assets/Svg'
import {
  AppBottomSheet,
  AppImage,
  AppText,
  Box,
  Container,
  MessageInput,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { goBack } from '@/Navigators'
import { chatStore, userStore } from '@/Stores'
import { Colors, screenHeight, XStyleSheet } from '@/Theme'
import { getHitSlop } from '@/Utils'
import { FlashList } from '@shopify/flash-list'
import React, { memo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

const ConversationDetailScreen = () => {
  const { t } = useTranslation()
  const sheetRef = useRef()
  const conversation = chatStore.getConversationById()
  const onBackPress = () => {
    goBack()
    chatStore.resetMessages()
  }
  const renderMessageItem = useCallback(({ item, index }) => {
    return <MessageItem message={item} />
  }, [])
  return (
    <Container style={styles.rootView}>
      <Box
        height={100}
        row
        align="center"
        justify="space-between"
        paddingRight={16}
      >
        <Row>
          <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
            <ChevronRightSvg color={Colors.white} />
          </TouchableOpacity>
          <View>
            <AppImage
              containerStyle={styles.userAvatar}
              source={{ uri: conversation?.user?.avatar_url }}
            />
            <Obx>
              {() => (
                <View
                  style={[
                    styles.statusPoint,
                    {
                      backgroundColor: chatStore.getIsOnline(
                        conversation.user.user_id,
                      )
                        ? Colors.k54B435
                        : Colors.gray,
                    },
                  ]}
                />
              )}
            </Obx>
          </View>
          <Padding left={10}>
            <AppText fontWeight={700} color={Colors.white}>
              {conversation?.user?.full_name}
            </AppText>
            <AppText fontSize={12} color={Colors.white50}>
              <Obx>
                {() =>
                  chatStore.getIsOnline(conversation.user.user_id)
                    ? t('conversations.active_now')
                    : t('conversations.inactive')
                }
              </Obx>
            </AppText>
          </Padding>
        </Row>
        <TouchableOpacity
          onPress={() => sheetRef.current?.snapTo?.(0)}
          hitSlop={getHitSlop(16)}
        >
          <DotsSvg color={Colors.white} />
        </TouchableOpacity>
      </Box>
      <Box
        fill
        backgroundColor={Colors.white}
        topLeftRadius={24}
        topRightRadius={24}
      >
        <Obx>
          {() => (
            <FlashList
              inverted
              data={chatStore.messages.slice()}
              renderItem={renderMessageItem}
              keyExtractor={item => item.message_id}
              estimatedItemSize={100}
            />
          )}
        </Obx>
        <MessageInput placeholder={t('message_placeholder')} />
      </Box>
      <AppBottomSheet ref={sheetRef} snapPoints={[0.5 * screenHeight]}>
        <Box fill padding={16}>
          <TouchableOpacity style={styles.optionBtn}>
            <ReportSvg size={20} />
            <Padding left={14} />
            <AppText fontSize={16} fontWeight={500}>
              {t('home.report_comment')}
            </AppText>
          </TouchableOpacity>
        </Box>
      </AppBottomSheet>
    </Container>
  )
}

export default ConversationDetailScreen

const MessageItem = memo(({ message }) => {
  const isUser = message.sent_by.user_id === userStore.userInfo.user_id
  const justify = isUser ? 'flex-end' : 'flex-start'
  const isSticker = message.is_sticker
  const isImage = message.is_image
  return <Box row justify={justify} height={10}></Box>
})
const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.primary,
  },
  userAvatar: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  statusPoint: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 12,
    width: 12,
    borderRadius: 10,
    borderColor: Colors.white,
    borderWidth: 2,
    zIndex: 99,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})
