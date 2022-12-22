import { NoteSvg } from '@/Assets/Svg'
import {
  AppBar,
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
import { mockUsers } from '@/Models'
import { navigate } from '@/Navigators'
import { searchUsers } from '@/Services/Api'
import { createPost, userStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import { isIOS } from '@/Utils'
import { autorun, flowResult, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CreatePost = ({ route }) => {
  const { medias } = route?.params
  const processedMedias = medias.map(m => ({ ...m, url: m.uri }))
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    message: '',
    mentionList: [],
    creating: false,
    setMessage: value => (state.message = value),
    setMentionList: value => (state.mentionList = value),
    setCreating: value => (state.creating = value),
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
  const onPostPress = async () => {
    state.setCreating(true)
    await createPost(state.message, processedMedias, () =>
      navigate(PageName.HomeScreen),
    )
    state.setCreating(false)
  }
  const { bottom } = useSafeAreaInsets()
  return (
    <Container style={styles.rootView}>
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
          <Box marginHorizontal={16} marginTop={14}>
            <AppText lineHeight={18} fontWeight={700}>
              {userStore.userInfo.user_id}
            </AppText>
            <Box
              marginTop={8}
              padding={12}
              radius={6}
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
                        key={user.user_id}
                      >
                        <AppImage
                          source={{
                            uri: user.avatar_url,
                          }}
                          containerStyle={styles.avatar}
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
      <Obx>{() => state.creating && <LoadingIndicator overlay />}</Obx>
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
})
