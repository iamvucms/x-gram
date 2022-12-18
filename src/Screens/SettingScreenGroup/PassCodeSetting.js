import { LockSvg } from '@/Assets/Svg'
import {
  AppBar,
  AppSwitch,
  AppText,
  Box,
  Container,
  Obx,
  Row,
} from '@/Components'
import { PageName } from '@/Config'
import { navigatePush } from '@/Navigators'
import { userStore } from '@/Stores'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, TouchableOpacity } from 'react-native'
const PrivacySetting = () => {
  const { t } = useTranslation()
  const onEnableChange = useCallback(enabled => {
    if (enabled) {
      navigatePush(PageName.AuthPassCodeScreen, {
        isSetupPasscode: true,
        callback: passcode => {
          userStore.setPasscode(passcode)
        },
      })
    } else {
      userStore.disablePasscode()
    }
  }, [])
  return (
    <Container safeAreaColor={Colors.white} style={styles.rootView}>
      <Box backgroundColor={Colors.white}>
        <AppBar title={t('setting.passcode')} />
      </Box>
      <Box fill padding={16}>
        <ScrollView style={Layout.fill} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => onEnableChange(!userStore.passcodeEnabled)}
            style={styles.subSettingView}
          >
            <Row>
              <Box size={44} center>
                <LockSvg size={16} />
              </Box>
              <AppText fontSize={16} fontWeight={500}>
                {t('setting.enable_passcode')}
              </AppText>
            </Row>
            <Obx>
              {() => (
                <AppSwitch
                  value={userStore.passcodeEnabled}
                  onValueChange={onEnableChange}
                />
              )}
            </Obx>
          </TouchableOpacity>
        </ScrollView>
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
