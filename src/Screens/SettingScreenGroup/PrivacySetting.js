import { ChevronRightSvg, LockSvg } from '@/Assets/Svg'
import { AppBar, AppText, Box, Container, Row } from '@/Components'
import { PageName } from '@/Config'
import { navigate, navigateReplace } from '@/Navigators'
import { userStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TouchableOpacity } from 'react-native'
const PrivacySetting = () => {
  const { t } = useTranslation()
  const subSettings = useMemo(
    () => [
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
          <AppText fontSize={16} fontWeight={500}>
            {item.title}
          </AppText>
        </Row>
        <ChevronRightSvg color={Colors.k8E8E8E} size={12} />
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
