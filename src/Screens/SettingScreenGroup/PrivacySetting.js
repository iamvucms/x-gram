import {
  ChevronRightSvg,
  CloseSvg,
  GlobalSvg,
  LockSvg,
  PhoneSvg,
  UserSvg,
} from '@/Assets/Svg'
import {
  AppBar,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { PageName } from '@/Config'
import { AutoDeleteType, PrivacyShowType, PrivacyType } from '@/Models'
import { navigate, navigateReplace } from '@/Navigators'
import { userStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TouchableOpacity, View } from 'react-native'
const PrivacySetting = () => {
  const { t } = useTranslation()
  const subSettings = useMemo(
    () => [
      {
        title: t('setting.content_privacy'),
        desc: t('setting.content_privacy_desc'),
        icon: <GlobalSvg size={18} />,
        rightComponent: (
          <Obx>
            {() => (
              <AppText fontWeight={600} fontSize={12} color={Colors.primary}>
                {userStore.contentPrivacyType === PrivacyType.Public
                  ? t('home.privacy_public')
                  : userStore.contentPrivacyType === PrivacyType.Followers
                  ? t('home.privacy_followers')
                  : t('home.privacy_private')}
              </AppText>
            )}
          </Obx>
        ),
        onPress: () => {
          if (userStore.contentPrivacyType === PrivacyType.Public) {
            userStore.setContentPrivacyType(PrivacyType.Followers)
          } else if (userStore.contentPrivacyType === PrivacyType.Followers) {
            userStore.setContentPrivacyType(PrivacyType.Private)
          } else {
            userStore.setContentPrivacyType(PrivacyType.Public)
          }
        },
      },
      {
        title: t('setting.phone_number'),
        desc: t('setting.who_can_see_phone_number'),
        icon: <PhoneSvg size={18} />,
        rightComponent: (
          <Obx>
            {() => (
              <AppText fontWeight={600} fontSize={12} color={Colors.primary}>
                {userStore.phonePrivacyType === PrivacyShowType.Everyone
                  ? t('setting.everyone')
                  : userStore.phonePrivacyType === PrivacyShowType.Followers
                  ? t('home.privacy_followers')
                  : t('setting.nobody')}
              </AppText>
            )}
          </Obx>
        ),
        onPress: () => {
          if (userStore.phonePrivacyType === PrivacyShowType.Everyone) {
            userStore.setPhonePrivacyType(PrivacyShowType.Followers)
          } else if (userStore.phonePrivacyType === PrivacyShowType.Followers) {
            userStore.setPhonePrivacyType(PrivacyShowType.Private)
          } else {
            userStore.setPhonePrivacyType(PrivacyShowType.Everyone)
          }
        },
      },
      {
        title: t('setting.profile_photo'),
        desc: t('setting.who_can_see_profile_photo'),
        icon: <UserSvg size={22} />,
        rightComponent: (
          <Obx>
            {() => (
              <AppText fontWeight={600} fontSize={12} color={Colors.primary}>
                {userStore.profilePhotoPrivacyType === PrivacyShowType.Everyone
                  ? t('setting.everyone')
                  : userStore.profilePhotoPrivacyType ===
                    PrivacyShowType.Followers
                  ? t('home.privacy_followers')
                  : t('setting.nobody')}
              </AppText>
            )}
          </Obx>
        ),
        onPress: () => {
          if (userStore.profilePhotoPrivacyType === PrivacyShowType.Everyone) {
            userStore.setProfilePhotoPrivacyType(PrivacyShowType.Followers)
          } else if (
            userStore.profilePhotoPrivacyType === PrivacyShowType.Followers
          ) {
            userStore.setProfilePhotoPrivacyType(PrivacyShowType.Private)
          } else {
            userStore.setProfilePhotoPrivacyType(PrivacyShowType.Everyone)
          }
        },
      },

      {
        title: t('setting.passcode'),
        icon: <LockSvg size={18} />,
        onPress: () => {
          if (userStore.passcodeEnabled) {
            navigate(PageName.AuthPassCodeScreen, {
              callback: () => navigateReplace(PageName.PassCodeSetting),
            })
          } else {
            navigate(PageName.PassCodeSetting)
          }
        },
      },
      {
        title: t('setting.auto_delete'),
        desc: t('setting.auto_delete_note'),
        icon: <CloseSvg size={30} />,
        rightComponent: (
          <Obx>
            {() => (
              <AppText fontWeight={600} fontSize={12} color={Colors.error}>
                {userStore.autoDeleteType === AutoDeleteType.OneMonth
                  ? t('setting.one_month')
                  : userStore.autoDeleteType === AutoDeleteType.ThreeMonths
                  ? t('setting.three_months')
                  : userStore.autoDeleteType === AutoDeleteType.HalfYear
                  ? t('setting.six_months')
                  : userStore.autoDeleteType === AutoDeleteType.OneYear
                  ? t('setting.one_year')
                  : t('setting.never')}
              </AppText>
            )}
          </Obx>
        ),
        onPress: () => {
          if (userStore.autoDeleteType === AutoDeleteType.Never) {
            userStore.setAutoDeleteType(AutoDeleteType.OneMonth)
          } else if (userStore.autoDeleteType === AutoDeleteType.OneMonth) {
            userStore.setAutoDeleteType(AutoDeleteType.ThreeMonths)
          } else if (userStore.autoDeleteType === AutoDeleteType.ThreeMonths) {
            userStore.setAutoDeleteType(AutoDeleteType.HalfYear)
          } else if (userStore.autoDeleteType === AutoDeleteType.HalfYear) {
            userStore.setAutoDeleteType(AutoDeleteType.OneYear)
          } else {
            userStore.setAutoDeleteType(AutoDeleteType.Never)
          }
        },
      },
    ],
    [t],
  )
  const renderSubSettingItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity onPress={item.onPress} style={styles.subSettingView}>
        <Row>
          <Box size={44} center>
            {item.icon}
          </Box>
          <View>
            <AppText fontSize={16} fontWeight={500}>
              {item.title}
            </AppText>
            {!!item.desc && (
              <AppText fontSize={10} lineHeight={12} color={Colors.black50}>
                {item.desc}
              </AppText>
            )}
          </View>
        </Row>
        <Row>
          {item.rightComponent ? (
            <>
              {item.rightComponent}
              <Padding left={4} />
            </>
          ) : null}
          <ChevronRightSvg color={Colors.k8E8E8E} size={12} />
        </Row>
      </TouchableOpacity>
    )
  }, [])
  return (
    <Container safeAreaColor={Colors.white} style={styles.rootView}>
      <Box backgroundColor={Colors.white}>
        <AppBar title={t('setting.privacy_and_security')} />
      </Box>
      <Box fill padding={16}>
        <FlatList
          data={subSettings}
          renderItem={renderSubSettingItem}
          keyExtractor={item => item.title}
        />
      </Box>
    </Container>
  )
}

export default PrivacySetting

const styles = XStyleSheet.create({
  rootView: {},
  subSettingView: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
})
