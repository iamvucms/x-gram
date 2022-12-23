import { ChevronDownSvg } from '@/Assets/Svg'
import {
  AppBar,
  AppBottomSheet,
  AppImage,
  AppInput,
  AppText,
  Box,
  Container,
  ErrorLabel,
  LoadingIndicator,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { mockUsers, PrivacyType } from '@/Models'
import { goBack } from '@/Navigators'
import { searchUsers } from '@/Services/Api'
import { findPostById, updatePostRequest } from '@/Stores'
import { Colors, Layout, screenHeight, XStyleSheet } from '@/Theme'
import { autorun, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const EditPostScreen = ({ route }) => {
  const { postId } = route.params
  const { t } = useTranslation()
  const privacySheetRef = useRef()
  const post = findPostById(postId)
  const state = useLocalObservable(() => ({
    privacy: post.privacy,
    message: post.message,
    mentionList: [],
    updating: false,
    setPrivacy: privacy => (state.privacy = privacy),
    setMessage: message => (state.message = message),
    setMentionList: mentionList => (state.mentionList = mentionList),
    setUpdating: updating => (state.updating = updating),
    get isValidMessage() {
      return state.message.trim().length > 0
    },
    get updatable() {
      return (
        state.isValidMessage &&
        (state.message !== post.message || state.privacy !== post.privacy)
      )
    },
  }))
  useEffect(() => {
    const regex = /@(\w*)$/
    let to = null
    const dispose = autorun(() => {
      state.message
      clearTimeout(to)
      to = setTimeout(() => {
        const q = toJS(state.message).match(regex)
        if (q) {
          searchUsers(q[1])
            .then(res => {
              if (res.status === 'OK') {
                state.setMentionList(res.data.slice(0, 5))
              } else {
                state.setMentionList(
                  mockUsers.filter(u => u.user_id.includes(q[1])),
                )
              }
            })
            .catch(() => {
              state.setMentionList(
                mockUsers.filter(u => u.user_id.includes(q[1])),
              )
            })
        } else {
          state.setMentionList([])
        }
      }, 300)
    })
    return () => {
      dispose()
      clearTimeout(to)
    }
  }, [])
  const onMentionUserPress = user => {
    state.setMessage(state.message.replace(/@(\w*)$/, `@${user.user_id} `))
  }
  const onUpdatePresss = useCallback(() => {
    state.setUpdating(true)
    updatePostRequest(postId, toJS(state.message), toJS(state.privacy), () => {
      state.setUpdating(false)
      goBack()
    })
  }, [])
  return (
    <Container style={styles.rootView}>
      <AppBar
        title={t('home.edit_post')}
        rightComponent={
          <Obx>
            {() => (
              <AppText
                color={state.updatable ? Colors.primary : Colors.gray}
                fontWeight={600}
              >
                {t('save')}
              </AppText>
            )}
          </Obx>
        }
        onRightPress={onUpdatePresss}
      />
      <Pressable
        onPress={() => privacySheetRef.current?.close?.()}
        style={Layout.fill}
      >
        <Box fill padding={16}>
          <Row row align="center">
            <AppImage
              source={{
                uri: post.posted_by.avatar_url,
              }}
              containerStyle={styles.avatar}
            />
            <Box fill>
              <AppText fontWeight={700}>{post.posted_by.full_name}</AppText>
              <Row justify="space-between">
                <TouchableOpacity
                  onPress={() => privacySheetRef.current?.snapTo?.(0)}
                  style={styles.privacyBtn}
                >
                  <AppText fontSize={12} lineHeight={12} fontWeight={600}>
                    {t('home.privacy_public')}
                  </AppText>
                  <Padding left={4} />
                  <ChevronDownSvg size={8} />
                </TouchableOpacity>
                <AppText
                  color={Colors.primary}
                  fontWeight={600}
                  fontSize={10}
                  lineHeight={12}
                >
                  <Obx>{() => `${state.message.length}`}</Obx>/200
                </AppText>
              </Row>
            </Box>
          </Row>
          <Box fill marginTop={16}>
            <Obx>
              {() => (
                <AppInput
                  value={state.message}
                  onChangeText={txt => state.setMessage(txt)}
                  placeholder={t('createPost.caption_placeholder')}
                  multiline
                  lineHeight={18}
                  maxLength={200}
                  autoFocus
                  autoCorrect={false}
                />
              )}
            </Obx>
            <Obx>
              {() =>
                !state.isValidMessage && (
                  <ErrorLabel text={t('createPost.caption_required')} />
                )
              }
            </Obx>

            <Obx>
              {() =>
                !!state.mentionList.length && (
                  <Animated.View style={Layout.fill} entering={FadeInDown}>
                    <Padding top={8} />
                    {state.mentionList.map(user => (
                      <TouchableOpacity
                        onPress={() => onMentionUserPress(user)}
                        style={styles.mentionUserBtn}
                        key={user.user_id}
                      >
                        <AppImage
                          source={{
                            uri: user.avatar_url,
                          }}
                          containerStyle={styles.mentionAvatar}
                        />
                        <Padding left={12}>
                          <AppText fontWeight={700}>{user.full_name}</AppText>
                          <AppText
                            fontSize={12}
                            fontWeight={600}
                            color={Colors.placeholder}
                          >
                            @{user.user_id}
                          </AppText>
                        </Padding>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                )
              }
            </Obx>
          </Box>
        </Box>
      </Pressable>

      <AppBottomSheet ref={privacySheetRef} snapPoints={[screenHeight * 0.2]}>
        <TouchableOpacity
          onPress={() => state.setPrivacy(PrivacyType.Public)}
          style={styles.privacyOptionBtn}
        >
          <View style={styles.leftPrivacyOption}>
            <Obx>
              {() => (
                <Box
                  size={20}
                  radius={10}
                  borderWidth={5}
                  borderColor={Colors.primary25}
                  backgroundColor={
                    state.privacy === PrivacyType.Public
                      ? Colors.primary
                      : Colors.white
                  }
                />
              )}
            </Obx>
          </View>
          <View>
            <AppText fontSize={16} fontWeight={500}>
              {t('home.privacy_public')}
            </AppText>
            <AppText fontSize={12} color={Colors.grey}>
              {t('home.privacy_public_desc')}
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => state.setPrivacy(PrivacyType.Followers)}
          style={styles.privacyOptionBtn}
        >
          <View style={styles.leftPrivacyOption}>
            <Obx>
              {() => (
                <Box
                  size={20}
                  radius={10}
                  borderWidth={5}
                  borderColor={Colors.primary25}
                  backgroundColor={
                    state.privacy === PrivacyType.Followers
                      ? Colors.primary
                      : Colors.white
                  }
                />
              )}
            </Obx>
          </View>
          <View>
            <AppText fontSize={16} fontWeight={500}>
              {t('home.privacy_followers')}
            </AppText>
            <AppText fontSize={12} color={Colors.grey}>
              {t('home.privacy_followers_desc')}
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => state.setPrivacy(PrivacyType.Private)}
          style={styles.privacyOptionBtn}
        >
          <View style={styles.leftPrivacyOption}>
            <Obx>
              {() => (
                <Box
                  size={20}
                  radius={10}
                  borderWidth={5}
                  borderColor={Colors.primary25}
                  backgroundColor={
                    state.privacy === PrivacyType.Private
                      ? Colors.primary
                      : Colors.white
                  }
                />
              )}
            </Obx>
          </View>
          <View>
            <AppText fontSize={16} fontWeight={500}>
              {t('home.privacy_private')}
            </AppText>
            <AppText fontSize={12} color={Colors.grey}>
              {t('home.privacy_private_desc')}
            </AppText>
          </View>
        </TouchableOpacity>
      </AppBottomSheet>
      <Obx>
        {() => <LoadingIndicator overlayVisible={state.updating} overlay />}
      </Obx>
    </Container>
  )
}

export default EditPostScreen

const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 12,
  },
  privacyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 0.5,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyOptionBtn: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftPrivacyOption: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentionUserBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.5,
  },
  mentionAvatar: {
    width: 36,
    height: 36,
    borderRadius: 14,
    overflow: 'hidden',
  },
})
