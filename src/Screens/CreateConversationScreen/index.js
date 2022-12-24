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
  Row,
} from '@/Components'
import { PageName } from '@/Config'
import { mockUsers } from '@/Models'
import { goBack, navigateReplace } from '@/Navigators'
import { searchUsers } from '@/Services/Api'
import { chatStore, userStore } from '@/Stores'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { getMediaUri, isIOS } from '@/Utils'
import { autorun, flowResult, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated'

const CreateConversationScreen = ({ route }) => {
  const { user } = route.params || {}
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    recommendUsers: [],
    results: [],
    search: '',
    loading: true,
    receiver: user,
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
      const users = toJS(chatStore.conversations)
        .map(c => c.user)
        .concat(toJS(userStore.following || []))
        .concat(toJS(userStore.followers || []))
      const obj = {}
      const recommendedUsers = []
      users.map(u => {
        if (!obj[u.user_id]) {
          obj[u.user_id] = true
          recommendedUsers.push(u)
        }
      })
      state.setRecommentUsers(recommendedUsers)
    })
    const disposeSearching = autorun(async () => {
      const q = state.search.toLowerCase()
      const recommendUsers = toJS(state.recommendUsers)
      const response = await searchUsers(q)
      if (response.status === 'OK') {
        const results = []
        const obj = {}
        recommendUsers.map(u => (obj[u.user_id] = true))
        response.data.map(u => {
          if (!obj[u.user_id]) {
            results.push(u)
          }
        })
        state.setResults(results)
      }
    })
    const to = setTimeout(() => {
      state.setLoading(false)
    }, 1000)
    return () => {
      dipose()
      disposeSearching()
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
          {section.title}
        </AppText>
      </Box>
    )
  }, [])
  const renderUserItem = useCallback(({ item }) => {
    const onPress = () => {
      const conversation = chatStore.getConversationByUserId(item.user_id)
      if (conversation) {
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
            uri: getMediaUri(item.avatar_url),
          }}
          containerStyle={styles.avatar}
        />
        <View>
          <AppText fontWeight={700}>{item.full_name}</AppText>
          <AppText color={Colors.black50}>@{item.user_name}</AppText>
        </View>
      </TouchableOpacity>
    )
  }, [])
  const onSendPress = useCallback(async (message, messageType) => {
    if (state.receiver) {
      const msg = {
        message,
        type: messageType,
        sent_by: toJS(userStore.userInfo),
      }
      state.setSending(true)
      await flowResult(chatStore.sendNewMessage(state.receiver.user_id, msg))
      const conversation = chatStore.getConversationByUserId(
        state.receiver.user_id,
      )
      state.setSending(false)
      if (conversation) {
        chatStore.fetchMessages(conversation.conversation_id)
        navigateReplace(PageName.ConversationDetailScreen)
      } else {
        console.log("Can't create conversation")
      }
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
            backgroundColor={Colors.primary}
            marginRight={12}
            center
          >
            <AppText fontWeight={700} color={Colors.white}>
              {t('conversations.to')}
            </AppText>
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
                placeholderTextColor={Colors.placeholder}
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
                    uri: getMediaUri(state.receiver.avatar_url),
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
              keyboardShouldPersistTaps="handled"
            />
          )
        }
      </Obx>
      <MessageInput allowStickers onSendPress={onSendPress} />
      {isIOS && <KeyboardSpacer />}
      <Obx>
        {() => <LoadingIndicator overlayVisible={state.sending} overlay />}
      </Obx>
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
    backgroundColor: Colors.gray,
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
