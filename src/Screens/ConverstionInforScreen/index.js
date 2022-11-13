import { ArrowRightSvg, BellSvg, BlockSvg, ProfileSvg } from '@/Assets/Svg'
import { AppImage, AppText, Box, Container, Obx, Padding } from '@/Components'
import { useAppTheme } from '@/Hooks'
import { goBack } from '@/Navigators'
import { chatStore, diaLogStore, userStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import { toJS } from 'mobx'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const ConverstionInforScreen = () => {
  const { t } = useTranslation()
  const { Images } = useAppTheme()
  const conversation = chatStore.getConversationById()
  const onBlockPress = useCallback(() => {
    diaLogStore.showDiaLog({
      title: userStore.isBlocked(conversation?.user?.user_id)
        ? t('account.unblock_user')
        : t('account.block_user'),
      message: userStore.isBlocked(conversation?.user?.user_id)
        ? t('account.confirm_unblock')
        : t('account.confirm_block'),
      buttonText: 'confirm',
      dialogIcon: Images.pack1_3,
      showCancelButton: true,
      onPress: () => {
        if (userStore.isBlocked(conversation?.user?.user_id)) {
          userStore.unblockUser(toJS(conversation.user))
        } else {
          userStore.blockUser(toJS(conversation.user))
        }
      },
    })
  }, [])

  return (
    <Container style={styles.rootView}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={goBack} style={styles.headerBtn}>
          <ArrowRightSvg />
        </TouchableOpacity>
        <Box height={250} center>
          <AppImage
            containerStyle={styles.avatar}
            source={{ uri: conversation?.user?.avatar_url }}
          />
          <Padding top={12} />
          <AppText fontSize={18} fontWeight={700}>
            {conversation?.user?.full_name}
          </AppText>
          <AppText fontSize={12}>@{conversation?.user?.user_id}</AppText>
          <Box marginTop={20} row justify="center" align="flex-start">
            <TouchableOpacity style={styles.optionBtn}>
              <ProfileSvg />
              <Padding top={4} />
              <AppText fontWeight={600} fontSize={12}>
                {t('conversations.view_profile')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                userStore.isMutedMessageNotification(
                  conversation?.user?.user_id,
                )
                  ? userStore.unmuteMessageNotification(
                      conversation?.user?.user_id,
                    )
                  : userStore.muteMessageNotification(
                      conversation?.user?.user_id,
                    )
              }
              style={styles.optionBtn}
            >
              <BellSvg />
              <Padding top={4} />
              <AppText align="center" fontWeight={600} fontSize={12}>
                <Obx>
                  {() =>
                    userStore.isMutedMessageNotification(
                      conversation?.user?.user_id,
                    )
                      ? t('conversations.turn_on_notification')
                      : t('conversations.turn_off_notification')
                  }
                </Obx>
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onBlockPress} style={styles.optionBtn}>
              <BlockSvg size={24} />
              <Padding top={4} />
              <AppText fontWeight={600} fontSize={12}>
                <Obx>
                  {() =>
                    userStore.isBlocked(conversation?.user?.user_id)
                      ? t('conversations.unblock_user')
                      : t('conversations.block_user')
                  }
                </Obx>
              </AppText>
            </TouchableOpacity>
          </Box>
        </Box>
      </ScrollView>
    </Container>
  )
}

export default ConverstionInforScreen

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.white,
  },
  headerBtn: {
    padding: 16,
    transform: [{ rotate: '180deg' }],
    alignSelf: 'flex-start',
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 999,
    overflow: 'hidden',
  },
  optionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    width: 90,
  },
})
