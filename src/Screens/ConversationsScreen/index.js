import {
  CheckSvg,
  ChevronRightSvg,
  DoubleCheckSvg,
  SearchSvg,
  SendSvg,
  TrashBinSvg,
} from '@/Assets/Svg'
import {
  AppImage,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { PageName } from '@/Config'
import { goBack, navigate } from '@/Navigators'
import { chatStore, userStore } from '@/Stores'
import {
  Colors,
  Layout,
  ResponsiveHeight,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { getHitSlop } from '@/Utils'
import { FlashList } from '@shopify/flash-list'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TouchableOpacity, View } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  FadeOutLeft,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ConversationsScreen = () => {
  const { t } = useTranslation()

  useEffect(() => {
    chatStore.fetchConversations()
  }, [])

  const renderConversationItem = useCallback(({ item }) => {
    const onPress = () => {
      chatStore.fetchMessages(item.conversation_id, false)
      navigate(PageName.ConversationDetailScreen)
    }
    const onRemove = () => {
      chatStore.deleleConversation(item.conversation_id)
    }
    return (
      <Pressable onPress={onPress}>
        <ConversationItem onRemove={onRemove} conversation={item} />
      </Pressable>
    )
  }, [])
  const { bottom } = useSafeAreaInsets()
  return (
    <Container style={styles.rootView}>
      <TouchableOpacity
        style={[
          styles.newConversationBtn,
          {
            bottom: bottom + 20,
          },
        ]}
      >
        <SendSvg size={20} color={Colors.white} />
      </TouchableOpacity>
      <Box
        row
        paddingVertical={12}
        paddingRight={16}
        align="center"
        justify="space-between"
      >
        <Row>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <ChevronRightSvg />
          </TouchableOpacity>
          <AppText lineHeightRatio={1.2} fontSize={24} fontWeight={800}>
            {t('conversations.conversations')}
          </AppText>
        </Row>
        <TouchableOpacity hitSlop={getHitSlop(20)}>
          <SearchSvg size={20} />
        </TouchableOpacity>
      </Box>
      <Animated.View style={[Layout.fill]}>
        <Obx>
          {() => (
            <FlashList
              showsVerticalScrollIndicator={false}
              data={chatStore.conversations.slice()}
              estimatedItemSize={ITEM_HEIGHT}
              renderItem={renderConversationItem}
              keyExtractor={item => item.conversation_id}
              ListFooterComponent={<Padding bottom={bottom} />}
              onEndReached={() => chatStore.fetchConversations(true)}
            />
          )}
        </Obx>
      </Animated.View>
    </Container>
  )
}

export default ConversationsScreen
const ITEM_HEIGHT = ResponsiveHeight(70)
const ConversationItem = observer(({ conversation, onRemove = () => {} }) => {
  const { t } = useTranslation()
  const translateX = useSharedValue(0)
  const removeAnim = useSharedValue(0)
  const itemScaleY = useSharedValue(1)
  const isUserSentLastMessage =
    conversation.last_message.sent_by.user_id === userStore.userInfo?.user_id
  const displayMessage = useMemo(() => {
    if (conversation.last_message.is_image) {
      if (isUserSentLastMessage) {
        return t('conversations.you_sent_photo')
      } else {
        return t('conversations.so_sent_photo').replace(
          '{{full_name}}',
          conversation.user.full_name,
        )
      }
    } else if (conversation.last_message.is_sticker) {
      if (isUserSentLastMessage) {
        return t('conversations.you_sent_sticker')
      } else {
        return t('conversations.so_sent_sticker').replace(
          '{{full_name}}',
          conversation.user.full_name,
        )
      }
    } else {
      if (isUserSentLastMessage) {
        return t('conversations.you_sent_message').replace(
          '{{message}}',
          conversation.last_message.message,
        )
      } else {
        return conversation.last_message.message
      }
    }
  }, [conversation.last_message])
  const panHandler = useAnimatedGestureHandler({
    onActive: event => {
      if (event.translationX > 0) {
        return
      }
      translateX.value = event.translationX
      if (event.translationX < -screenWidth / 2 && removeAnim.value === 0) {
        removeAnim.value = withSpring(1)
      } else if (
        event.translationX > -screenWidth / 2 &&
        removeAnim.value === 1
      ) {
        removeAnim.value = withTiming(0, { duration: 300 })
      }
    },
    onEnd: event => {
      if (event.translationX < -screenWidth / 2) {
        translateX.value = withTiming(
          -screenWidth,
          { duration: 200 },
          isFinished => {
            if (isFinished) {
              itemScaleY.value = withTiming(
                0,
                { duration: 200 },
                isFinished2 => isFinished2 && runOnJS(onRemove)(),
              )
            }
          },
        )
      } else {
        translateX.value = withTiming(0, { duration: 200 })
      }
    },
  })
  const conversationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))
  const trashIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(removeAnim.value, [0, 1], [0.9, 1.2]) }],
  }))
  const trashContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      removeAnim.value,
      [0, 1],
      [Colors.kE0144C50, Colors.kE0144C],
    ),
  }))
  const containerStyle = useAnimatedStyle(() => ({
    height: interpolate(itemScaleY.value, [0, 1], [0, ITEM_HEIGHT]),
  }))
  return (
    <PanGestureHandler activeOffsetX={-20} onGestureEvent={panHandler}>
      <Animated.View
        exiting={FadeOutLeft}
        style={[Layout.fullWidth, containerStyle]}
      >
        <Animated.View style={[styles.deleteView, trashContainerStyle]}>
          <Animated.View style={trashIconStyle}>
            <TrashBinSvg color={Colors.white} />
          </Animated.View>
        </Animated.View>
        <Animated.View style={[styles.conversationView, conversationStyle]}>
          <View style={styles.avatarView}>
            <AppImage
              containerStyle={styles.avatarImg}
              source={{ uri: conversation.user.avatar_url }}
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
          <Box fill>
            <Row justify="space-between">
              <AppText fontWeight={700}>{conversation.user.full_name}</AppText>
              <AppText
                fontSize={12}
                fontWeight={400}
                color={Colors.placeholder}
              >
                {moment(conversation.updated_at).fromNow()}
              </AppText>
            </Row>
            <Padding top={4} />
            <Row>
              <Obx>
                {() => (
                  <>
                    <AppText
                      numberOfLines={1}
                      style={styles.lastMsgTxt}
                      color={
                        conversation.last_message.seen || isUserSentLastMessage
                          ? Colors.placeholder
                          : Colors.black
                      }
                      fontWeight={
                        conversation.last_message.seen || isUserSentLastMessage
                          ? 400
                          : 700
                      }
                    >
                      {displayMessage}
                    </AppText>
                    <Padding right={4} />
                    {!isUserSentLastMessage ? (
                      conversation.last_message.seen ? (
                        <DoubleCheckSvg size={18} color={Colors.placeholder} />
                      ) : (
                        <CheckSvg size={18} color={Colors.placeholder} />
                      )
                    ) : null}
                  </>
                )}
              </Obx>
            </Row>
          </Box>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  )
})
const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.white,
  },
  conversationContainer: {
    marginVertical: 8,
  },
  conversationView: {
    overflow: 'hidden',
    height: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  avatarView: {
    marginRight: 12,
  },
  avatarImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderColor: Colors.border,
    borderWidth: 0.5,
  },
  statusPoint: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    height: 15,
    width: 15,
    borderRadius: 10,
    borderColor: Colors.white,
    borderWidth: 2,
    zIndex: 99,
  },
  lastMsgTxt: {
    maxWidth: 200,
  },
  deleteView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    alignItems: 'center',
  },
  newConversationBtn: {
    position: 'absolute',
    zIndex: 99,
    bottom: 20,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
})
