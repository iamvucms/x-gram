import {
  ArrowRightSvg,
  BellSvg,
  BlockSvg,
  CheckSvg,
  ProfileSvg,
  ReportSvg,
  ShareSvg,
  TrashBinSvg,
} from '@/Assets/Svg'
import {
  AppBottomSheet,
  AppImage,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
  Position,
} from '@/Components'
import { PageName } from '@/Config'
import { useAppTheme } from '@/Hooks'
import { DrawColors, getBackgrounds } from '@/Models'
import { goBack, navigate, navigateToProfile } from '@/Navigators'
import { chatStore, diaLogStore, userStore } from '@/Stores'
import {
  Colors,
  ResponsiveHeight,
  screenHeight,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Share, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { ScrollView } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'

const ConverstionInforScreen = () => {
  const { t } = useTranslation()
  const { Images } = useAppTheme()
  const themeSheetRef = useRef()
  const backgroundSheetRef = useRef()
  const conversation = chatStore.getConversationById()
  const backgrounds = useMemo(
    () => getBackgrounds({ imageSource: Images }),
    [Images],
  )
  const state = useLocalObservable(() => ({
    loading: true,
    setLoading: loading => (state.loading = loading),
  }))
  useEffect(() => {
    const to = setTimeout(() => {
      state.setLoading(false)
    }, 1500)
    return () => clearTimeout(to)
  }, [])
  const onBlockPress = useCallback(() => {
    diaLogStore.showDiaLog({
      title: userStore.isBlocked(conversation?.user?.user_id)
        ? t('account.unblock_user')
        : t('account.block_user'),
      message: userStore.isBlocked(conversation?.user?.user_id)
        ? t('account.confirm_unblock')
        : t('account.confirm_block'),
      buttonText: 'confirm',
      dialogIcon: userStore.isBlocked(conversation?.user?.user_id)
        ? Images.pack1_1
        : Images.pack1_3,
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
  const onDeleteConversationPress = useCallback(() => {
    diaLogStore.showDiaLog({
      title: t('conversations.delete_conversation'),
      message: t('conversations.delete_conversation_confirm'),
      buttonText: 'confirm',
      dialogIcon: Images.pack1_3,
      showCancelButton: true,
      onPress: () => {
        navigate(PageName.ConversationsScreen)
        setTimeout(() => {
          chatStore.deleleConversation(conversation.conversation_id)
        }, 500)
      },
    })
  }, [])
  const onSharePress = useCallback(() => {
    //TODO: update share link
    Share.share({
      message: 'https://xgram.app.link/message/' + conversation?.user?.user_id,
      url: 'https://xgram.app.link/message/' + conversation?.user?.user_id,
      title: 'Share Link',
    })
  }, [])
  const renderThemeColorItem = useCallback((color, index) => {
    const colors = Array.isArray(color) ? color : [color, color]
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          chatStore.setThemeColorIndex(index)
          themeSheetRef.current?.close?.()
        }}
        style={styles.themeColorBtn}
      >
        <LinearGradient colors={colors} style={styles.themeColorCircle} />
        <Obx>
          {() =>
            chatStore.themeColorIdx === index && (
              <Position>
                <Box
                  size={10}
                  radius={5}
                  backgroundColor={
                    colors.every(c => c === Colors.white)
                      ? Colors.black
                      : Colors.white
                  }
                />
              </Position>
            )
          }
        </Obx>
      </TouchableOpacity>
    )
  }, [])
  const renderBackgroundItem = useCallback((background, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          chatStore.setThemeBackgroundIndex(
            index === chatStore.themeBackgroundIdx ? -1 : index,
          )
          backgroundSheetRef.current?.close?.()
        }}
      >
        <FastImage style={styles.backgroundImg} source={background} />
        <Obx>
          {() =>
            chatStore.themeBackgroundIdx === index && (
              <View style={styles.selectedPoint}>
                <CheckSvg size={12} color={Colors.white} />
              </View>
            )
          }
        </Obx>
      </TouchableOpacity>
    )
  }, [])
  return (
    <Container style={styles.rootView}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={goBack} style={styles.headerBtn}>
          <ArrowRightSvg />
        </TouchableOpacity>
        <Box height={250} center>
          <AppImage
            lightbox
            containerStyle={styles.avatar}
            source={{ uri: conversation?.user?.avatar_url }}
          />
          <Padding top={12} />
          <AppText fontSize={18} fontWeight={700}>
            {conversation?.user?.full_name}
          </AppText>
          <AppText fontSize={12}>@{conversation?.user?.user_id}</AppText>
          <Box marginTop={20} row justify="center" align="flex-start">
            <TouchableOpacity
              onPress={() => navigateToProfile(conversation?.user?.user_id)}
              style={styles.optionBtn}
            >
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
        <Box borderTopColor={Colors.border} borderTopWidth={0.6}>
          <TouchableOpacity
            onPress={() => themeSheetRef?.current?.snapTo?.(0)}
            style={styles.customBtn}
          >
            <AppText fontWeight={600}>
              {t('conversations.conversation_theme')}
            </AppText>
            <Obx>
              {() => (
                <Box center>
                  <LinearGradient
                    style={styles.themeColorView}
                    colors={chatStore.themeColors}
                  />
                  <Position>
                    <Box size={5} radius={5} backgroundColor={Colors.white} />
                  </Position>
                </Box>
              )}
            </Obx>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => backgroundSheetRef?.current?.snapTo?.(0)}
            style={styles.customBtn}
          >
            <AppText fontWeight={600}>
              {t('conversations.conversation_background')}
            </AppText>
            <Obx>
              {() => (
                <FastImage
                  style={styles.backgroundSquare}
                  source={backgrounds[chatStore.themeBackgroundIdx]}
                />
              )}
            </Obx>
          </TouchableOpacity>
          <Padding horizontal={16} top={16} bottom={8}>
            <AppText color={Colors.black50}>{t('other')}</AppText>
          </Padding>
          <TouchableOpacity onPress={onSharePress} style={styles.customBtn}>
            <AppText fontWeight={600}>
              {t('conversations.share_contact')}
            </AppText>
            <ShareSvg size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.customBtn}>
            <AppText fontWeight={600}>{t('conversations.report_user')}</AppText>
            <ReportSvg size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDeleteConversationPress}
            style={styles.customBtn}
          >
            <AppText color={Colors.error} fontWeight={600}>
              {t('conversations.delete_conversation')}
            </AppText>
            <TrashBinSvg color={Colors.error} size={20} />
          </TouchableOpacity>
        </Box>
      </ScrollView>
      <AppBottomSheet
        snapPoints={[screenHeight * 0.6]}
        backgroundStyle={styles.sheetHeader}
        ref={themeSheetRef}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <Box row flexWrap="wrap" justify="space-between">
            <Obx>
              {() => !state.loading && DrawColors.map(renderThemeColorItem)}
            </Obx>
          </Box>
        </BottomSheetScrollView>
      </AppBottomSheet>
      <AppBottomSheet
        snapPoints={[screenHeight * 0.7]}
        backgroundStyle={styles.sheetHeader}
        ref={backgroundSheetRef}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <Box row flexWrap="wrap" justify="space-between">
            <Obx>
              {() => !state.loading && backgrounds.map(renderBackgroundItem)}
            </Obx>
          </Box>
        </BottomSheetScrollView>
      </AppBottomSheet>
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
  customBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.5,
  },
  themeColorView: {
    height: 20,
    width: 20,
    borderRadius: 99,
    overflow: 'hidden',
    borderColor: Colors.primary,
    borderWidth: 0.5,
  },
  themeColorCircle: {
    height: 50,
    width: 50,
    borderRadius: 99,
    overflow: 'hidden',
    borderColor: Colors.primary,
    borderWidth: 0.5,
  },
  themeColorBtn: {
    skipResponsive: true,
    width: screenWidth / 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsiveHeight(12),
  },
  sheetHeader: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderBottomWidth: 0,
    marginHorizontal: -0.5,
  },
  backgroundSquare: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderColor: Colors.primary,
    borderWidth: 0.5,
  },
  backgroundImg: {
    width: screenWidth / 3,
    aspectRatio: 3 / 4,
    skipResponsive: true,
  },
  selectedPoint: {
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    bottom: 8,
    right: 8,
    backgroundColor: Colors.primary,
    borderColor: Colors.white,
    borderWidth: 1,
  },
})
