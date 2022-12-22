import { ChevronRightSvg, GlobalSvg, InfoCircleSvg } from '@/Assets/Svg'
import { AppBar, AppText, Box, Container, Padding, Row } from '@/Components'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { Colors, XStyleSheet } from '@/Theme'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TouchableOpacity, View } from 'react-native'
const AccountSetting = () => {
  const { t } = useTranslation()
  const subSettings = useMemo(
    () => [
      {
        title: t('setting.account_info'),
        desc: t('setting.account_info_desc'),
        icon: <InfoCircleSvg size={18} />,
        onPress: () => navigate(PageName.AccountInformationSetting),
      },
      {
        title: t('setting.basic_info'),
        desc: t('setting.basic_info_desc'),
        icon: <GlobalSvg size={18} />,
        onPress: () => navigate(PageName.BasicInformationSetting),
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
        <AppBar title={t('setting.account')} />
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

export default AccountSetting

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
