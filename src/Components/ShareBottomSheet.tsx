import { LinkSvg, SendSvg, ShareSvg, SmsSvg, WeChatSvg } from '@/Assets/Svg'
import { mockUsers, ShareType } from '@/Models'
import { AppFonts, Colors, Layout, screenHeight, XStyleSheet } from '@/Theme'
import { isAndroid } from '@/Utils'
import { BottomSheetFlatList, TouchableOpacity } from '@gorhom/bottom-sheet'
import { useLocalObservable } from 'mobx-react-lite'
import React, { forwardRef, memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TextInput, View } from 'react-native'
import { LoadingIndicator, Obx, Padding } from '.'
import AppBottomSheet from './AppBottomSheet'
import AppImage from './AppImage'
import AppText from './AppText'
import Box from './Box'

interface ShareBottomSheetProps {
  comments: any[]
  data: any
  type: ShareType
  onClose: () => void
}
const ShareBottomSheet = forwardRef(
  ({ data, onClose }: ShareBottomSheetProps, ref) => {
    const { t } = useTranslation()
    const state = useLocalObservable(() => ({
      users: mockUsers,
      message: '',
      loading: true,
      setLoading: (loading: boolean) => (state.loading = loading),
      setMessage: (message: string) => (state.message = message),
      setUsers: (users: any[]) => (state.users = users),
      setSent: (user_id: string) => {
        const u = state.users.find(u => u.user_id === user_id)
        if (u) {
          u.sent = true
        }
      },
    }))

    useEffect(() => {
      const to = setTimeout(() => {
        state.setLoading(false)
      }, 1000)
      return () => clearTimeout(to)
    }, [])

    const renderUserItem = useCallback(({ item, index }) => {
      const onSendPress = () => {
        //api call
        state.setSent(item.user_id)
      }
      return (
        <Box paddingVertical={8} paddingHorizontal={16} row align="center">
          <AppImage
            source={{
              uri: item.avatar_url,
            }}
            containerStyle={styles.avatarImg}
          />
          <Padding style={Layout.fill} left={12}>
            <AppText fontWeight={700}>{item.full_name}</AppText>
            <Padding top={2} />
            <AppText color={Colors.black50}>{item.user_id}</AppText>
          </Padding>
          <Obx>
            {() => (
              <TouchableOpacity
                disabled={item.sent}
                style={[
                  styles.sendBtn,
                  item.sent && { backgroundColor: Colors.disabled },
                ]}
                onPress={onSendPress}
              >
                <AppText color={Colors.white}>
                  {item.sent ? t('sent') : t('send')}
                </AppText>
                <Padding left={6} />
                <SendSvg color={Colors.white} size={12} />
              </TouchableOpacity>
            )}
          </Obx>
        </Box>
      )
    }, [])

    const _onClose = useCallback(() => {
      Keyboard.dismiss()
      onClose && onClose()
    }, [])
    return (
      <AppBottomSheet
        onClose={_onClose}
        index={0}
        snapPoints={[screenHeight - 100]}
        ref={ref}
      >
        <View style={Layout.fill}>
          <View style={styles.messageView}>
            <AppImage
              source={{ uri: 'https://picsum.photos/200/300' }}
              containerStyle={styles.referralImage}
            />
            <Obx>
              {() => (
                <TextInput
                  placeholder={t('message_placeholder')}
                  placeholderTextColor={Colors.placeholder}
                  style={styles.textInput}
                  value={state.message}
                  onChangeText={txt => state.setMessage(txt)}
                />
              )}
            </Obx>
          </View>
          <Obx>
            {() =>
              state.loading ? (
                <Box center fill>
                  <LoadingIndicator type="Circle" />
                </Box>
              ) : (
                <BottomSheetFlatList
                  data={state.users.slice()}
                  keyExtractor={item => item.user_id}
                  renderItem={renderUserItem}
                />
              )
            }
          </Obx>
          <View style={styles.otherOptionsView}>
            <TouchableOpacity style={styles.shareBtn}>
              <Box
                marginBottom={10}
                size={60}
                radius={99}
                backgroundColor={Colors.border}
                center
              >
                <ShareSvg />
              </Box>
              <AppText align="center" color={Colors.black75} fontWeight={700}>
                {' '}
                {t('home.share_to')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Box
                marginBottom={10}
                size={60}
                radius={99}
                backgroundColor={Colors.border}
                center
              >
                <LinkSvg />
              </Box>
              <AppText align="center" color={Colors.black75} fontWeight={700}>
                {' '}
                {t('home.copy_link')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Box
                marginBottom={10}
                size={60}
                radius={99}
                backgroundColor={Colors.border}
                center
              >
                <WeChatSvg size={34} />
              </Box>
              <AppText align="center" color={Colors.black75} fontWeight={700}>
                {' '}
                {t('home.we_chat')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Box
                marginBottom={10}
                size={60}
                radius={99}
                backgroundColor={Colors.border}
                center
              >
                <SmsSvg />
              </Box>
              <AppText align="center" color={Colors.black75} fontWeight={700}>
                {' '}
                {t('home.sms')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </AppBottomSheet>
    )
  },
)

export default memo(ShareBottomSheet)

const styles = XStyleSheet.create({
  headerView: {
    borderBottomWidth: 0.6,
    borderColor: Colors.border,
  },
  photoBtn: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 99,
  },
  textInput: {
    fontFamily: AppFonts['400'],
    color: Colors.black,
    flex: 1,
    paddingHorizontal: 10,
    ...(isAndroid && {
      marginVertical: -15,
    }),
  },
  messageView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.5,
    paddingHorizontal: 16,
  },
  referralImage: {
    height: 50,
    width: 50,
    borderRadius: 5,
    overflow: 'hidden',
  },
  otherOptionsView: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    paddingVertical: 16,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shareBtn: {
    marginHorizontal: 10,
  },
  avatarImg: {
    height: 50,
    width: 50,
    borderRadius: 99,
    overflow: 'hidden',
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
})
