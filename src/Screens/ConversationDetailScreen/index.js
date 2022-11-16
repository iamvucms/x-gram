import {
  ChevronRightSvg,
  CloseSvg,
  CopySvg,
  EyeOffSvg,
  InforSvg,
  ReportSvg,
} from '@/Assets/Svg'
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
import { PageName } from '@/Config'
import { useAppTheme } from '@/Hooks'
import { getBackgrounds, MessageStatus, MessageType } from '@/Models'
import { goBack, navigate } from '@/Navigators'
import { chatStore, userStore } from '@/Stores'
import {
  Colors,
  ResponsiveWidth,
  screenHeight,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { getHitSlop } from '@/Utils'
import Clipboard from '@react-native-clipboard/clipboard'
import { autorun, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import moment from 'moment'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

const ConversationDetailScreen = () => {
  const { t } = useTranslation()
  const optionSheetRef = useRef()
  const { Images } = useAppTheme()
  const conversation = chatStore.getConversationById()
  const state = useLocalObservable(() => ({
    selectedMessage: null,
    setSelectedMessage: message => (state.selectedMessage = message),
  }))
  const backgrounds = useMemo(
    () => getBackgrounds({ imageSource: Images }),
    [Images],
  )
  useEffect(() => {
    // return () => chatStore.resetMessages()
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
    const onOpenOption = () => {
      optionSheetRef.current?.snapTo(0)
      state.setSelectedMessage(item)
    }
    return <MessageItem onOpenOption={onOpenOption} message={item} />
  }, [])
  return (
    <Container disableTop>
      <Box
        height={124}
        row
        align="center"
        justify="space-between"
        paddingRight={16}
      >
        <Obx>
          {() => (
            <LinearGradient
              colors={chatStore.themeColors}
              style={styles.msgBackground}
            />
          )}
        </Obx>
        <Row>
          <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
            <Obx>
              {() => (
                <ChevronRightSvg
                  color={
                    chatStore.themeColors.every(c => c === Colors.white)
                      ? Colors.black
                      : Colors.white
                  }
                />
              )}
            </Obx>
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
                        conversation?.user?.user_id,
                      )
                        ? Colors.k54B435
                        : Colors.gray,
                    },
                  ]}
                />
              )}
            </Obx>
          </View>
          <Obx>
            {() => (
              <Padding left={10}>
                <AppText
                  fontWeight={700}
                  color={
                    chatStore.themeColors.every(c => c === Colors.white)
                      ? Colors.black
                      : Colors.white
                  }
                >
                  {conversation?.user?.full_name}
                </AppText>
                <AppText
                  fontSize={12}
                  color={
                    chatStore.themeColors.every(c => c === Colors.white)
                      ? Colors.black50
                      : Colors.white
                  }
                >
                  <Obx>
                    {() =>
                      chatStore.getIsOnline(conversation?.user?.user_id)
                        ? t('conversations.active_now')
                        : t('conversations.inactive')
                    }
                  </Obx>
                </AppText>
              </Padding>
            )}
          </Obx>
        </Row>
        <TouchableOpacity
          onPress={() => navigate(PageName.ConverstionInforScreen)}
          hitSlop={getHitSlop(16)}
        >
          <Obx>
            {() => (
              <InforSvg
                color={
                  chatStore.themeColors.every(c => c === Colors.white)
                    ? Colors.black
                    : Colors.white
                }
              />
            )}
          </Obx>
        </TouchableOpacity>
      </Box>
      <Box
        fill
        backgroundColor={Colors.white}
        topLeftRadius={24}
        topRightRadius={24}
        marginTop={-24}
        borderColor={Colors.border}
        borderWidth={0.5}
        marginHorizontal={-0.5}
        overflow="hidden"
      >
        <Obx>
          {() =>
            chatStore.themeBackgroundIdx !== -1 && (
              <FastImage
                style={styles.backgroundImg}
                source={backgrounds[chatStore.themeBackgroundIdx]}
              />
            )
          }
        </Obx>
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
          allowStickers
          onSendPress={onSendPress}
          placeholder={t('message_placeholder')}
        />
      </Box>
      <AppBottomSheet
        backgroundStyle={styles.sheetHeader}
        ref={optionSheetRef}
        snapPoints={[0.35 * screenHeight]}
      >
        <Box
          paddingVertical={16}
          center
          borderBottomWidth={0.5}
          borderBottomColor={Colors.border}
        >
          <AppText fontSize={16} fontWeight={700}>
            {t('conversations.message_actions')}
          </AppText>
        </Box>
        <Box fill padding={16}>
          <Obx>
            {() =>
              state.selectedMessage?.status === MessageStatus.ERROR && (
                <TouchableOpacity
                  onPress={() => {
                    chatStore.deleteUnSentMessages(
                      state.selectedMessage.message_id,
                    )
                    optionSheetRef.current?.close?.()
                  }}
                  style={styles.optionBtn}
                >
                  <CloseSvg size={20} />
                  <Padding left={14} />
                  <AppText fontSize={16} fontWeight={500}>
                    {t('conversations.cancel_message')}
                  </AppText>
                </TouchableOpacity>
              )
            }
          </Obx>
          <Obx>
            {() =>
              state.selectedMessage?.type === MessageType.Text && (
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(state.selectedMessage.message)
                    optionSheetRef.current?.close?.()
                  }}
                  style={styles.optionBtn}
                >
                  <CopySvg size={20} />
                  <Padding left={14} />
                  <AppText fontSize={16} fontWeight={500}>
                    {t('conversations.copy_message')}
                  </AppText>
                </TouchableOpacity>
              )
            }
          </Obx>
          <TouchableOpacity
            onPress={() => {
              if (
                userStore.isHiddenMessage(state.selectedMessage?.message_id)
              ) {
                userStore.removeHiddenMessage(state.selectedMessage?.message_id)
              } else {
                userStore.addHiddenMessage(state.selectedMessage?.message_id)
              }
              optionSheetRef.current?.close?.()
            }}
            style={styles.optionBtn}
          >
            <EyeOffSvg size={20} />
            <Padding left={14} />
            <AppText fontSize={16} fontWeight={500}>
              <Obx>
                {() =>
                  userStore.isHiddenMessage(state.selectedMessage?.message_id)
                    ? t('conversations.unhide_message')
                    : t('conversations.hide_message')
                }
              </Obx>
            </AppText>
          </TouchableOpacity>
          <Obx>
            {() =>
              state.selectedMessage?.sent_by?.user_id !==
                userStore.userInfo?.user_id && (
                <TouchableOpacity
                  onPress={() => {
                    //TODO send report
                    optionSheetRef.current?.close?.()
                  }}
                  style={styles.optionBtn}
                >
                  <ReportSvg size={20} />
                  <Padding left={14} />
                  <AppText fontSize={16} fontWeight={500}>
                    {t('conversations.report_message')}
                  </AppText>
                </TouchableOpacity>
              )
            }
          </Obx>
        </Box>
      </AppBottomSheet>
    </Container>
  )
}

export default ConversationDetailScreen

const MessageItem = memo(({ message, onOpenOption }) => {
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
    } else if (message.status !== MessageStatus.SENDING) {
      infoAnim.value = withTiming(infoAnim.value === 0 ? 1 : 0)
    }
  }
  const infoStyle = useAnimatedStyle(() => ({
    height: interpolate(infoAnim.value, [0, 1], [0, 15]),
    opacity: interpolate(infoAnim.value, [0, 1], [0, 1]),
    overflow: 'hidden',
  }))

  return (
    <Pressable onLongPress={onOpenOption} onPress={onPress}>
      <Obx>
        {() => (
          <Box
            opacity={userStore.isHiddenMessage(message.message_id) ? 0.5 : 1}
            row
            justify={justify}
            paddingHorizontal={16}
            marginBottom={16}
          >
            <View>
              <Animated.View style={[styles.msgTime, infoStyle]}>
                <Obx>
                  {() => (
                    <AppText
                      fontSize={10}
                      fontWeight={700}
                      color={
                        chatStore.themeBackgroundIdx !== -1
                          ? Colors.white50
                          : Colors.black50
                      }
                    >
                      {moment(message.created_at).format('HH:mm')}
                    </AppText>
                  )}
                </Obx>
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
                  <FastImage
                    source={parseInt(message.message, 10)}
                    style={styles.msgSticker}
                  />
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
                        borderColor={isUser ? Colors.black50 : ''}
                        borderWidth={
                          isUser &&
                          chatStore.themeColors.every(c => c === Colors.white)
                            ? 0.5
                            : 0
                        }
                        overflow="hidden"
                        backgroundColor={isUser ? null : Colors.gray}
                      >
                        <Obx>
                          {() =>
                            isUser && (
                              <LinearGradient
                                colors={chatStore.themeColors}
                                style={styles.msgBackground}
                              />
                            )
                          }
                        </Obx>
                        <Obx>
                          {() => (
                            <AppText
                              color={
                                isUser &&
                                chatStore.themeColors.every(
                                  c => c === Colors.white,
                                )
                                  ? Colors.black
                                  : Colors.white
                              }
                            >
                              {message.message}
                            </AppText>
                          )}
                        </Obx>
                      </Box>
                    )}
                  </Obx>
                )}
              </Row>
              <Animated.View
                style={[
                  infoStyle,
                  {
                    marginLeft: isUser
                      ? ResponsiveWidth(24)
                      : ResponsiveWidth(64),
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
                          : chatStore.themeBackgroundIdx !== -1
                          ? Colors.white50
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
        )}
      </Obx>
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
  msgBackground: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backgroundImg: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
})
