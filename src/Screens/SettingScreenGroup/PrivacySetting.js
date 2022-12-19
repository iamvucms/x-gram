import { ChevronRightSvg, GlobalSvg, LockSvg } from '@/Assets/Svg'
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
import { PrivacyType } from '@/Models'
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
        title: t('auth.default_privacy'),
        desc: t('auth.default_privacy_desc'),
        icon: <GlobalSvg size={18} />,
        rightComponent: (
          <Obx>
            {() => (
              <AppText fontWeight={600} fontSize={12} color={Colors.primary}>
                {userStore.defaultPrivacyType === PrivacyType.Public
                  ? t('home.privacy_public')
                  : userStore.defaultPrivacyType === PrivacyType.Followers
                  ? t('home.privacy_followers')
                  : t('home.privacy_private')}
              </AppText>
            )}
          </Obx>
        ),
        onPress: () => {
          if (userStore.defaultPrivacyType === PrivacyType.Public) {
            userStore.setDefaultPrivacyType(PrivacyType.Followers)
          } else if (userStore.defaultPrivacyType === PrivacyType.Followers) {
            userStore.setDefaultPrivacyType(PrivacyType.Private)
          } else {
            userStore.setDefaultPrivacyType(PrivacyType.Public)
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
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
})
