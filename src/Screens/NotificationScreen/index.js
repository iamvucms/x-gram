import {
  BellOffSvg,
  DoubleCheckSvg,
  EyeOffSvg,
  EyeOnSvg,
  RemoveSvg,
} from '@/Assets/Svg'
import {
  AppBottomSheet,
  AppImage,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
} from '@/Components'
import { notiStore } from '@/Stores'
import { AppFonts, Colors, ResponsiveHeight, XStyleSheet } from '@/Theme'
import {
  getHitSlop,
  getNotificationText,
  groupNotificationByDate,
  processNavigationNotification,
} from '@/Utils'
import { useFocusEffect } from '@react-navigation/native'
import { useLocalObservable } from 'mobx-react-lite'
import moment from 'moment'
import React, { memo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const NotificationScreen = () => {
  const { t } = useTranslation()
  const sheetRef = useRef()
  const state = useLocalObservable(() => ({
    selectedNotification: null,
    setSelectedNotification: notification =>
      (state.selectedNotification = notification),
  }))
  useFocusEffect(
    useCallback(() => {
      return () => sheetRef.current?.close?.()
    }, []),
  )
  const renderSectionTitle = useCallback(({ section }) => {
    return (
      <View>
        <Box
          paddingHorizontal={16}
          paddingVertical={12}
          backgroundColor={Colors.background}
        >
          <AppText fontWeight={700} color={Colors.secondary}>
            {section.title}
          </AppText>
        </Box>
        <LinearGradient
          colors={[Colors.white, Colors.transparent]}
          style={styles.sectionAura}
        />
      </View>
    )
  }, [])
  const renderNotiItem = useCallback(({ item }) => {
    const onPress = () => {
      processNavigationNotification(item)
      notiStore.addSeenId(item.notification_id)
    }
    const onLongPress = () => {
      state.setSelectedNotification(item)
      sheetRef.current?.snapTo?.(0)
    }
    return (
      <NotificationItem
        item={item}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    )
  }, [])

  return (
    <Container safeAreaColor={Colors.background}>
      <Box row align="center" justify="space-between" marginHorizontal={16}>
        <AppText fontSize={24} fontWeight={700} color={Colors.primary}>
          {t('notifications.notifications')}
        </AppText>
        <TouchableOpacity
          hitSlop={getHitSlop(16)}
          onPress={() => notiStore.markAllAsSeen()}
        >
          <DoubleCheckSvg color={Colors.primary} />
        </TouchableOpacity>
      </Box>
      <Box fill>
        <Obx>
          {() => {
            const groupedNotifications = groupNotificationByDate(
              notiStore.notifications,
            )
            const sections = Object.keys(groupedNotifications).map(date => ({
              title: date,
              data: groupedNotifications[date],
            }))
            return (
              <SectionList
                showsVerticalScrollIndicator={false}
                sections={sections}
                keyExtractor={item => item.notification_id}
                renderItem={renderNotiItem}
                renderSectionHeader={renderSectionTitle}
                stickySectionHeadersEnabled
                ListFooterComponent={<Padding bottom={110} />}
              />
            )
          }}
        </Obx>
      </Box>
      <AppBottomSheet
        backgroundStyle={styles.sheetHeader}
        ref={sheetRef}
        snapPoints={[ResponsiveHeight(360)]}
      >
        <Box fill>
          <Box
            paddingVertical={16}
            center
            borderBottomWidth={0.5}
            borderBottomColor={Colors.border}
          >
            <AppText fontSize={16} fontWeight={700}>
              {t('home.comment_options')}
            </AppText>
          </Box>
          <Obx>
            {() =>
              state.selectedNotification && (
                <>
                  <Box paddingVertical={12}>
                    <AppImage
                      source={{
                        uri: state.selectedNotification.user.avatar_url,
                      }}
                      containerStyle={[styles.avatar, styles.previewNotiAvatar]}
                    />
                    <Box
                      marginTop={10}
                      marginHorizontal={16}
                      padding={12}
                      radius={8}
                      backgroundColor={Colors.primary25}
                      center
                      borderWidth={1}
                      borderColor={Colors.primary}
                    >
                      <AppText
                        numberOfLines={2}
                        fontWeight={600}
                        parse={[
                          {
                            pattern: /".+"/,

                            style: {
                              fontFamily: AppFonts['400'],
                              color: Colors.placeholder,
                            },
                          },
                        ]}
                      >
                        {getNotificationText(state.selectedNotification, t)}
                      </AppText>
                    </Box>
                  </Box>
                  <TouchableOpacity
                    onPress={() => {
                      notiStore.deleteNotification(
                        state.selectedNotification.notification_id,
                      )
                      sheetRef.current?.close?.()
                    }}
                    style={styles.optionBtn}
                  >
                    <RemoveSvg size={20} />
                    <Padding left={14} />
                    <AppText fontSize={16} fontWeight={500}>
                      {t('notifications.delete_notification')}
                    </AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      notiStore.getIsSeen(
                        state.selectedNotification.notification_id,
                      )
                        ? notiStore.removeSeenId(
                            state.selectedNotification.notification_id,
                          )
                        : notiStore.addSeenId(
                            state.selectedNotification.notification_id,
                          )
                      sheetRef.current?.close?.()
                    }}
                    style={styles.optionBtn}
                  >
                    <Obx>
                      {() =>
                        notiStore.getIsSeen(
                          state.selectedNotification.notification_id,
                        ) ? (
                          <EyeOffSvg size={20} />
                        ) : (
                          <EyeOnSvg size={20} />
                        )
                      }
                    </Obx>
                    <Padding left={14} />
                    <AppText fontSize={16} fontWeight={500}>
                      <Obx>
                        {() =>
                          notiStore.getIsSeen(
                            state.selectedNotification.notification_id,
                          )
                            ? t('notifications.mark_as_unread')
                            : t('notifications.mark_as_read')
                        }
                      </Obx>
                    </AppText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}} style={styles.optionBtn}>
                    <BellOffSvg size={20} />
                    <Padding left={14} />
                    <AppText fontSize={16} fontWeight={500}>
                      {t('notifications.turn_off_notification')}
                    </AppText>
                  </TouchableOpacity>
                </>
              )
            }
          </Obx>
        </Box>
      </AppBottomSheet>
    </Container>
  )
}

export default NotificationScreen
const NotificationItem = memo(({ item, onLongPress, onPress }) => {
  const { t } = useTranslation()
  return (
    <Obx>
      {() => (
        <TouchableOpacity
          disabled={!onLongPress || !onPress}
          onLongPress={onLongPress}
          onPress={onPress}
          style={[
            styles.notiView,
            !notiStore.getIsSeen(item.notification_id) && styles.notiViewUnseen,
          ]}
        >
          <AppImage
            disabled
            source={{
              uri: item.user.avatar_url,
            }}
            containerStyle={styles.avatar}
          />
          <Box fill>
            <AppText
              numberOfLines={2}
              fontWeight={600}
              parse={[
                {
                  pattern: /".+"/,

                  style: {
                    fontFamily: AppFonts['400'],
                    color: Colors.placeholder,
                  },
                },
              ]}
            >
              {getNotificationText(item, t)}
            </AppText>
            <Padding top={4} />
            <AppText fontSize={10} fontWeight={500} color={Colors.placeholder}>
              {moment(item.created_at).fromNow()}
            </AppText>
          </Box>
        </TouchableOpacity>
      )}
    </Obx>
  )
})
const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.white,
  },
  notiView: {
    backgroundColor: Colors.white,
    padding: 10,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  sectionAura: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    height: 20,
    zIndex: 99,
  },
  notiViewUnseen: {
    backgroundColor: Colors.primary25,
  },
  sheetHeader: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderBottomWidth: 0,
    marginHorizontal: -0.5,
  },
  previewNotiAvatar: {
    alignSelf: 'center',
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})
