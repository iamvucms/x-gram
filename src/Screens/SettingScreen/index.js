import {
  ArrowRightSvg,
  BellSvg,
  ChevronRightSvg,
  LanguageSvg,
  LockSvg,
  LogoutSvg,
  PaperSvg,
  UserSvg,
} from '@/Assets/Svg'
import {
  AppSwitch,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { PageName } from '@/Config'
import { goBack, navigate, navigateAndReset } from '@/Navigators'
import { appStore, diaLogStore, userStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SettingScreen = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  return (
    <Container safeAreaColor={Colors.primaryLight}>
      <Box
        height={125}
        justify="space-between"
        backgroundColor={Colors.primaryLight}
        paddingBottom={47}
      >
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <ArrowRightSvg color={Colors.white} />
        </TouchableOpacity>
        <AppText
          align="center"
          color={Colors.white}
          fontSize={24}
          lineHeight={24}
          fontWeight={700}
        >
          {t('setting.settings')}
        </AppText>
      </Box>
      <Box
        fill
        backgroundColor={Colors.background}
        marginTop={-30}
        radius={30}
        paddingTop={20}
        paddingHorizontal={16}
      >
        <TouchableOpacity
          onPress={() =>
            userStore.setMutedAllNotification(!userStore.mutedAllNotification)
          }
          activeOpacity={0.8}
          style={styles.settingBtn}
        >
          <Row>
            <Box size={44} center>
              <BellSvg size={22} />
            </Box>
            <AppText fontSize={16} fontWeight={500}>
              {t('notifications.notifications')}
            </AppText>
          </Row>
          <Obx>
            {() => (
              <AppSwitch
                value={userStore.mutedAllNotification}
                onValueChange={value =>
                  userStore.setMutedAllNotification(value)
                }
              />
            )}
          </Obx>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate(PageName.AccountSetting)}
          activeOpacity={0.8}
          style={styles.settingBtn}
        >
          <Row>
            <Box size={44} center>
              <UserSvg size={20} />
            </Box>
            <AppText fontSize={16} fontWeight={500}>
              {t('setting.account')}
            </AppText>
          </Row>
          <ChevronRightSvg color={Colors.k8E8E8E} size={12} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate(PageName.PrivacySetting)}
          activeOpacity={0.8}
          style={styles.settingBtn}
        >
          <Row>
            <Box size={44} center>
              <LockSvg size={18} />
            </Box>
            <AppText fontSize={16} fontWeight={500}>
              {t('setting.privacy_and_security')}
            </AppText>
          </Row>
          <ChevronRightSvg color={Colors.k8E8E8E} size={12} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate(PageName.LanguageSetting)}
          activeOpacity={0.8}
          style={styles.settingBtn}
        >
          <Row>
            <Box size={44} center>
              <LanguageSvg size={20} />
            </Box>
            <AppText fontSize={16} fontWeight={500}>
              {t('setting.language')}
            </AppText>
          </Row>
          <Row>
            <AppText fontSize={12} color={Colors.k8E8E8E}>
              <Obx>{() => appStore.currentLanguage?.name}</Obx>
            </AppText>
            <Padding left={4} />
            <ChevronRightSvg color={Colors.k8E8E8E} size={12} />
          </Row>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.settingBtn}>
          <Row>
            <Box size={44} center>
              <PaperSvg size={18} />
            </Box>
            <AppText fontSize={16} fontWeight={500}>
              {t('setting.term_and_conditions')}
            </AppText>
          </Row>
          <ChevronRightSvg color={Colors.k8E8E8E} size={12} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            diaLogStore.showDiaLog({
              title: t('setting.logout'),
              message: t('setting.logout_confirm'),
              buttonText: t('profile.logout'),
              showCancelButton: true,
              onPress: () => {
                navigateAndReset([PageName.PreAuthStack])
                userStore.logout()
              },
            })
          }}
          activeOpacity={0.8}
          style={styles.settingBtn}
        >
          <Row>
            <Box size={44} center>
              <LogoutSvg color={Colors.error} size={18} />
            </Box>
            <AppText color={Colors.error} fontSize={16} fontWeight={500}>
              {t('profile.logout')}
            </AppText>
          </Row>
        </TouchableOpacity>
      </Box>
      <Box center paddingBottom={bottom || 16}>
        <AppText fontWeight={600} fontSize={12} color={Colors.primary}>
          {t('setting.app_version')}: 1.0.0
        </AppText>
      </Box>
    </Container>
  )
}

export default SettingScreen

const styles = XStyleSheet.create({
  backBtn: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  settingBtn: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
})
