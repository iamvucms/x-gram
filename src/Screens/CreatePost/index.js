import {
  AppBar,
  AppButton,
  AppImage,
  AppInput,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
  PostItem,
} from '@/Components'
import { mockUsers } from '@/Models'
import { searchUsers } from '@/Services/Api'
import { userStore } from '@/Stores'
import { Colors, screenHeight, XStyleSheet } from '@/Theme'
import { autorun, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CreatePost = ({ route }) => {
  const { medias } = route?.params
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    message: '',
    setMessage: value => (state.message = value),
    mentionList: [],
    setMentionList: value => (state.mentionList = value),
  }))
  useEffect(() => {
    const regex = /@(\w+)$/
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
    state.setMessage(state.message.replace(/@(\w+)$/, `@${user.user_id} `))
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
              medias: medias.map(m => ({ ...m, url: m.uri })),
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
              height={78}
              backgroundColor={Colors.primary25}
            >
              <Obx>
                {() => (
                  <AppInput
                    value={state.message}
                    onChangeText={txt => state.setMessage(txt)}
                    placeholder={t('createPost.caption_placeholder')}
                    multiline
                    lineHeight={18}
                  />
                )}
              </Obx>
            </Box>

            <Obx>
              {() =>
                !!state.mentionList.length && (
                  <Animated.View entering={FadeIn}>
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
                )
              }
            </Obx>
          </Box>
        </KeyboardAwareScrollView>
      </Box>
      <Box
        backgroundColor={Colors.primary25}
        paddingHorizontal={16}
        paddingBottom={bottom || 16}
        paddingTop={16}
      >
        <AppButton text={t('createPost.create_post')} />
      </Box>
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
})
