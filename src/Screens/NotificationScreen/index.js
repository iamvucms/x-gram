import { AppImage, AppText, Box, Container, Obx, Padding } from '@/Components'
import { notiStore } from '@/Stores'
import { AppFonts, Colors, XStyleSheet } from '@/Theme'
import {
  getNotificationText,
  groupNotificationByDate,
  processNavigationNotification,
} from '@/Utils'
import moment from 'moment'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const NotificationScreen = () => {
  const { t } = useTranslation()
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
    const onLongPress = () => {}
    return (
      <Obx>
        {() => (
          <TouchableOpacity
            onLongPress={onLongPress}
            onPress={onPress}
            style={[
              styles.notiView,
              !notiStore.getIsSeen(item.notification_id) &&
                styles.notiViewUnseen,
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
              <AppText
                fontSize={10}
                fontWeight={500}
                color={Colors.placeholder}
              >
                {moment(item.created_at).fromNow()}
              </AppText>
            </Box>
          </TouchableOpacity>
        )}
      </Obx>
    )
  }, [])

  return (
    <Container safeAreaColor={Colors.background}>
      <Box marginHorizontal={16}>
        <AppText fontSize={24} fontWeight={700} color={Colors.primary}>
          {t('notifications.notifications')}
        </AppText>
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
    </Container>
  )
}

export default NotificationScreen

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
})
