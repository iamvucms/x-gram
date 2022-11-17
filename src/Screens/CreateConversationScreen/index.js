import { ChevronRightSvg, SendSvg } from '@/Assets/Svg'
import {
  AppImage,
  AppInput,
  AppText,
  Box,
  Container,
  KeyboardSpacer,
  LoadingIndicator,
  MessageInput,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { PageName } from '@/Config'
import { mockUsers } from '@/Models'
import { goBack, navigate, navigateReplace } from '@/Navigators'
import { chatStore, userStore } from '@/Stores'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { isIOS } from '@/Utils'
import { autorun, flowResult, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated'

const CreateConversationScreen = () => {
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    recommendUsers: mockUsers,
    results: mockUsers,
    search: '',
    loading: true,
    receiver: null,
    sending: false,
    setRecommentUsers: users => (state.recommendUsers = users),
    setResults: results => (state.results = results),
    setSearch: search => (state.search = search),
    setLoading: loading => (state.loading = loading),
    setReceiver: receiver => (state.receiver = receiver),
    setSending: sending => (state.sending = sending),
    get sections() {
      return [
        {
          title: t('results'),
          data: this.results.slice(),
        },
        {
          title: t('recommended'),
          data: this.recommendUsers.slice(),
        },
      ]
    },
  }))
  useEffect(() => {
    const dipose = autorun(() => {
      state.setRecommentUsers(
        toJS(chatStore.conversations)
          .map(c => c.user)
          .concat(toJS(userStore.followings || []))
          .concat(toJS(userStore.followers || [])),
      )
    })
    const to = setTimeout(() => {
      state.setLoading(false)
    }, 1000)
    return () => {
      dipose()
      clearTimeout(to)
    }
  }, [])
  const renderSectionHeader = useCallback(({ section }) => {
    return section.data.length === 0 ? null : (
      <Box
        paddingHorizontal={16}
        paddingVertical={12}
        backgroundColor={Colors.white}
      >
        <AppText fontWeight={700} fontSize={16}>
          {section.title} ({section.data.length})
        </AppText>
      </Box>
    )
  }, [])
  const renderUserItem = useCallback(({ item }) => {
    const onPress = () => {
      const conversation = chatStore.getConversationByUserId(item.user_id)
      if (!conversation) {
        chatStore.fetchMessages(conversation.conversation_id, false)
        navigateReplace(PageName.ConversationDetailScreen)
      } else {
        state.setReceiver(item)
      }
    }
    return (
      <TouchableOpacity onPress={onPress} style={styles.userBtn}>
        <AppImage
          source={{
            uri: item.avatar_url,
          }}
          containerStyle={styles.avatar}
        />
        <View>
          <AppText fontWeight={700}>{item.full_name}</AppText>
          <AppText color={Colors.black50}>@{item.user_id}</AppText>
        </View>
      </TouchableOpacity>
    )
  }, [])
  const onSendPress = useCallback(async (message, messageType) => {
    if (state.receiver) {
      state.setSending(true)
      const msg = {
        message,
        created_at: new Date().getTime(),
        type: messageType,
        sent_by: toJS(userStore.userInfo),
      }
      await flowResult(
        chatStore.createNewConversation(state.receiver.user_id, msg),
      )
      const conversation = chatStore.getConversationByUserId(
        state.receiver.user_id,
      )
      if (conversation) {
        chatStore.fetchMessages(conversation.conversation_id)
        navigateReplace(PageName.ConversationDetailScreen)
      } else {
        console.log("Can't create conversation")
      }
      state.setSending(false)
    }
  }, [])
  return (
    <Container style={styles.rootView}>
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
            {t('conversations.new_conversation')}
          </AppText>
        </Row>
      </Box>
      <Box marginHorizontal={16} marginBottom={16} row align="center">
        <Animated.View entering={FadeInLeft.delay(500)}>
          <Box
            paddingHorizontal={12}
            height={40}
            radius={99}
            backgroundColor={Colors.border}
            marginRight={12}
            center
          >
            <AppText fontWeight={700}>{t('conversations.to')}</AppText>
          </Box>
        </Animated.View>
        <Animated.View style={Layout.fill} entering={FadeInRight.delay(500)}>
          <Obx>
            {() => (
              <AppInput
                fontWeight={700}
                value={state.search}
                onChangeText={txt => state.setSearch(txt)}
                style={styles.searchInput}
                placeholder={t('conversations.user_name_placeholder')}
              />
            )}
          </Obx>
        </Animated.View>
      </Box>
      <Obx>
        {() =>
          state.receiver && (
            <Box row align="center" paddingHorizontal={16} paddingVertical={12}>
              <AppText fontWeight={700} color={Colors.primary}>
                {t('conversations.send_to')}:{' '}
              </AppText>
              <Box marginLeft={12} marginRight={8}>
                <AppImage
                  source={{
                    uri: state.receiver.avatar_url,
                  }}
                  containerStyle={styles.receiverAvatar}
                />
                <View style={styles.sendIcon}>
                  <SendSvg size={10} color={Colors.white} />
                </View>
              </Box>
              <View>
                <AppText fontWeight={700} fontSize={12}>
                  {state.receiver.full_name}
                </AppText>
                <AppText color={Colors.black50} fontSize={10}>
                  @{state.receiver.user_id}
                </AppText>
              </View>
            </Box>
          )
        }
      </Obx>
      <Obx>
        {() =>
          state.loading ? (
            <Box fill center>
              <LoadingIndicator />
            </Box>
          ) : (
            <SectionList
              stickySectionHeadersEnabled
              sections={state.sections.slice()}
              keyExtractor={item => item.user_id}
              renderItem={renderUserItem}
              renderSectionHeader={renderSectionHeader}
              showsVerticalScrollIndicator={false}
            />
          )
        }
      </Obx>
      <MessageInput allowStickers onSendPress={onSendPress} />
      {isIOS && <KeyboardSpacer />}
      <Obx>{() => state.sending && <LoadingIndicator overlay />}</Obx>
    </Container>
  )
}

export default CreateConversationScreen

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.white,
  },
  backBtn: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    backgroundColor: Colors.border,
    borderRadius: 99,
    paddingHorizontal: 12,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
  },
  userBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  receiverAvatar: {
    height: 40,
    width: 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sendIcon: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.white,
    borderWidth: 2,
    position: 'absolute',
    bottom: -5,
    left: 25,
  },
})
