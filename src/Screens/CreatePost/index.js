import { ChevronDownSvg, NoteSvg } from '@/Assets/Svg'
import {
  AppBar,
  AppBottomSheet,
  AppButton,
  AppImage,
  AppInput,
  AppText,
  Box,
  Container,
  ErrorLabel,
  KeyboardSpacer,
  LoadingIndicator,
  Obx,
  Padding,
  PostItem,
} from '@/Components'
import { PageName } from '@/Config'
import { PrivacyType, mockUsers } from '@/Models'
import { navigate } from '@/Navigators'
import { searchUsers } from '@/Services/Api'
import { createPost, userStore } from '@/Stores'
import { Colors, XStyleSheet, screenHeight } from '@/Theme'
import { getMediaUri, isIOS } from '@/Utils'
import { autorun, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CreatePost = ({ route }) => {
  const { medias } = route?.params

  const processedMedias = medias.map(m => ({ ...m, url: m.uri }))
  const { t } = useTranslation()
  const privacySheetRef = useRef()
  const state = useLocalObservable(() => ({
    message:
      'Hello this is my photo. How do you feel about this. Drop a comment and don’t forget to send me a like. Thanks!',
    mentionList: [],
    creating: false,
    privacy: PrivacyType.Public,
    setMessage: value => (state.message = value),
    setMentionList: value => (state.mentionList = value),
    setCreating: value => (state.creating = value),
    setPrivacy: value => (state.privacy = value),
    get isValid() {
      return state.message.trim().length > 0
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
                  mockUsers.filter(u => u.user_name.includes(q[1])),
                )
              }
            })
            .catch(() => {
              state.setMentionList(
                mockUsers.filter(u => u.user_name.includes(q[1])),
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
    state.setMessage(state.message.replace(/@(\w*)$/, `@${user.user_name} `))
  }
  const onPostPress = async () => {
    state.setCreating(true)
    await createPost(state.message, processedMedias, state.privacy, () =>
      navigate(PageName.HomeScreen),
    )
    state.setCreating(false)
  }
  const closePrivacySheet = () => privacySheetRef.current?.close?.()
  const { bottom } = useSafeAreaInsets()
  return (
    <Container safeAreaColor={Colors.gray} style={styles.rootView}>
      <AppBar title={t('createPost.create_post')} />
      <Box fill>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          extraScrollHeight={300}
          enableOnAndroid
        >
          <PostItem
            preview
            post={{
              medias: processedMedias,
              posted_by: userStore.userInfo,
            }}
          />
          <TouchableOpacity
            onPress={() => privacySheetRef.current?.snapTo?.(0)}
            style={styles.privacyBtn}
          >
            <AppText fontSize={12} lineHeight={12} fontWeight={600}>
              <Obx>
                {() =>
                  state.privacy === PrivacyType.Public
                    ? t('home.privacy_public')
                    : state.privacy === PrivacyType.Followers
                    ? t('home.privacy_followers')
                    : t('home.privacy_private')
                }
              </Obx>
            </AppText>
            <Padding left={4} />
            <ChevronDownSvg size={8} />
          </TouchableOpacity>
          <Box marginHorizontal={16} marginTop={12}>
            <Box
              padding={12}
              radius={8}
              height={90}
              backgroundColor={Colors.primary10}
            >
              <Obx>
                {() => (
                  <AppInput
                    value={state.message}
                    onChangeText={txt => state.setMessage(txt)}
                    placeholder={t('createPost.caption_placeholder')}
                    multiline
                    lineHeight={18}
                    maxLength={200}
                  />
                )}
              </Obx>
              <View style={styles.lengthView}>
                <AppText
                  color={Colors.primary}
                  fontWeight={600}
                  fontSize={10}
                  lineHeight={12}
                >
                  <Obx>{() => `${state.message.length}`}</Obx>/200
                </AppText>
              </View>
            </Box>
            <Obx>
              {() =>
                !state.isValid && (
                  <ErrorLabel text={t('createPost.caption_required')} />
                )
              }
            </Obx>

            <Obx>
              {() =>
                state.mentionList.length ? (
                  <Animated.View entering={FadeInDown}>
                    <Padding top={4} />
                    <AppText fontWeight={700}>{t('results')}</AppText>
                    {state.mentionList.map(user => (
                      <TouchableOpacity
                        onPress={() => onMentionUserPress(user)}
                        style={styles.mentionUserBtn}
                        key={user.user_name}
                      >
                        <AppImage
                          source={{
                            uri: getMediaUri(user.avatar_url),
                          }}
                          containerStyle={styles.avatar}
                        />
                        <Padding left={12}>
                          <AppText fontWeight={700}>{user.full_name}</AppText>
                        </Padding>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                ) : (
                  <Box center paddingVertical={30}>
                    <NoteSvg size={80} />
                    <Padding top={8} />
                    <AppText fontWeight={700}>
                      {t('createPost.mention_friends')}
                    </AppText>
                    <AppText fontSize={12} color={Colors.placeholder}>
                      {t('createPost.mention_note')}
                    </AppText>
                  </Box>
                )
              }
            </Obx>
          </Box>
        </KeyboardAwareScrollView>
      </Box>
      <Box
        borderTopColor={Colors.border}
        borderTopWidth={0.5}
        paddingHorizontal={16}
        paddingBottom={bottom || 16}
        paddingTop={16}
      >
        <Obx>
          {() => (
            <AppButton
              onPress={onPostPress}
              disabled={!state.isValid}
              text={t('createPost.create_post')}
            />
          )}
        </Obx>
        {isIOS && <KeyboardSpacer topSpacing={16 - bottom} />}
      </Box>
      <AppBottomSheet ref={privacySheetRef} snapPoints={[screenHeight * 0.3]}>
        <TouchableOpacity
          onPress={() => {
            state.setPrivacy(PrivacyType.Public)
            closePrivacySheet()
          }}
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
          onPress={() => {
            state.setPrivacy(PrivacyType.Followers)
            closePrivacySheet()
          }}
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
          onPress={() => {
            state.setPrivacy(PrivacyType.Private)
            closePrivacySheet()
          }}
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
      <Obx>{() => state.creating && <LoadingIndicator overlay />}</Obx>
      <Obx>
        {() => <LoadingIndicator overlayVisible={state.creating} overlay />}
      </Obx>
    </Container>
  )
}

export default CreatePost

const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
  },
  mentionUserBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 14,
    overflow: 'hidden',
  },
  lengthView: {
    position: 'absolute',
    right: 6,
    bottom: 4,
  },
  privacyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.border,
    borderWidth: 0.5,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
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
})
