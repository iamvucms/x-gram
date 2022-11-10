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
import { MessageStatus, MessageType } from '@/Models'
import { goBack } from '@/Navigators'
import { chatStore, userStore } from '@/Stores'
import {
  Colors,
  ResponsiveWidth,
  screenHeight,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { getHitSlop } from '@/Utils'
import { autorun, toJS } from 'mobx'
import moment from 'moment'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

const ConversationDetailScreen = () => {
  const { t } = useTranslation()
  const sheetRef = useRef()
  const conversation = chatStore.getConversationById()
  useEffect(() => {
    return () => chatStore.resetMessages()
  }, [])
  const onBackPress = () => {
    goBack()
    chatStore.resetMessages()
  }
  const onSendPress = useCallback((message, messageType, retryId) => {
    const msg = {
      message,
      created_at: new Date().getTime(),
      type: messageType,
      sent_by: toJS(userStore.userInfo),
    }
    chatStore.sendMessage(conversation.conversation_id, msg, retryId)
  }, [])
  const renderMessageItem = useCallback(({ item }) => {
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
            <FlatList
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              keyboardShouldPersistTaps="handled"
              inverted
              data={chatStore.messages.slice()}
              renderItem={renderMessageItem}
              keyExtractor={item => item.message_id}
              ListFooterComponent={<Padding top={16} />}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Obx>
        <MessageInput
          onSendPress={onSendPress}
          placeholder={t('message_placeholder')}
        />
      </Box>
      <AppBottomSheet
        backgroundStyle={styles.sheetHeader}
        ref={sheetRef}
        snapPoints={[0.3 * screenHeight]}
      >
        <Box
          paddingVertical={16}
          center
          borderBottomWidth={0.5}
          borderBottomColor={Colors.border}
        >
          <AppText fontSize={16} fontWeight={700}>
            {t('conversations.conversation_options')}
          </AppText>
        </Box>
        <Box fill padding={16}>
          <TouchableOpacity style={styles.optionBtn}>
            <ReportSvg size={20} />
            <Padding left={14} />
            <AppText fontSize={16} fontWeight={500}>
              {t('conversations.view_profile')}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <ReportSvg size={20} />
            <Padding left={14} />
            <AppText fontSize={16} fontWeight={500}>
              {t('conversations.report_user')}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <ReportSvg size={20} />
            <Padding left={14} />
            <AppText fontSize={16} fontWeight={500}>
              {t('conversations.block_user')}
            </AppText>
          </TouchableOpacity>
        </Box>
      </AppBottomSheet>
    </Container>
  )
}

export default ConversationDetailScreen

const MessageItem = memo(({ message }) => {
  const { t } = useTranslation()
  const infoAnim = useSharedValue(0)
  const isUser = message.sent_by.user_id === userStore.userInfo.user_id
  const justify = isUser ? 'flex-end' : 'flex-start'
  const isSticker = message.type === MessageType.Sticker
  const isImage = message.type === MessageType.Image
  const isText = message.type === MessageType.Text
  useEffect(() => {
    const dispose = autorun(() => {
      if (
        message.status === MessageStatus.SENDING ||
        message.status === MessageStatus.ERROR
      ) {
        infoAnim.value = withDelay(200, withTiming(1))
      }
    })
    return () => dispose()
  }, [])
  const onPress = () => {
    if (message.status === MessageStatus.ERROR) {
      chatStore.sendMessage(
        chatStore.conversationId,
        {
          ...message,
        },
        message.message_id,
      )
    } else {
      infoAnim.value = withTiming(infoAnim.value === 0 ? 1 : 0)
    }
  }
  const infoStyle = useAnimatedStyle(() => ({
    height: interpolate(infoAnim.value, [0, 1], [0, 15]),
    opacity: interpolate(infoAnim.value, [0, 1], [0, 1]),
    overflow: 'hidden',
  }))

  return (
    <Pressable onPress={onPress}>
      <Box row justify={justify} paddingHorizontal={16} marginBottom={16}>
        <View>
          <Animated.View style={[styles.msgTime, infoStyle]}>
            <AppText fontSize={10} fontWeight={700} color={Colors.black50}>
              {moment(message.created_at).format('HH:mm')}
            </AppText>
          </Animated.View>
          <Row align="flex-start">
            {!isUser && (
              <AppImage
                source={{
                  uri: message.sent_by.avatar_url,
                }}
                containerStyle={styles.msgUserAvatar}
              />
            )}
            {isSticker && (
              <AppImage source={21} containerStyle={styles.msgSticker} />
            )}
            {isImage && (
              <AppImage
                source={{ uri: message.message }}
                containerStyle={styles.msgImage}
                lightbox
              />
            )}
            {isText && (
              <Obx>
                {() => (
                  <Box
                    opacity={
                      message.status === MessageStatus.SENDING ||
                      message.status === MessageStatus.ERROR
                        ? 0.5
                        : 1
                    }
                    marginLeft={16}
                    padding={10}
                    radius={16}
                    maxWidth={0.6 * screenWidth}
                    minWidth={40}
                    center
                    backgroundColor={isUser ? Colors.primary : Colors.gray}
                  >
                    <AppText color={Colors.white}>{message.message}</AppText>
                  </Box>
                )}
              </Obx>
            )}
          </Row>
          <Animated.View
            style={[
              infoStyle,
              {
                marginLeft: isUser ? ResponsiveWidth(24) : ResponsiveWidth(64),
              },
            ]}
          >
            <Obx>
              {() => (
                <AppText
                  fontSize={10}
                  fontWeight={700}
                  color={
                    message.status === MessageStatus.ERROR
                      ? Colors.error
                      : Colors.black50
                  }
                >
                  {message.status === MessageStatus.SENDING
                    ? t('conversations.sending')
                    : message.status === MessageStatus.SENT
                    ? t('conversations.sent')
                    : message.status === MessageStatus.ERROR
                    ? t('conversations.error')
                    : t('conversations.seen')}
                </AppText>
              )}
            </Obx>
          </Animated.View>
        </View>
      </Box>
    </Pressable>
  )
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
    backgroundColor: Colors.white,
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
    paddingVertical: 12,
  },
  msgUserAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  msgSticker: {
    height: 100,
    width: 100,
    marginLeft: 16,
  },
  msgImage: {
    height: 200,
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 16,
  },
  msgTime: {
    alignSelf: 'flex-end',
    marginRight: 8,
  },
  sheetHeader: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderBottomWidth: 0,
    marginHorizontal: -0.5,
  },
})
