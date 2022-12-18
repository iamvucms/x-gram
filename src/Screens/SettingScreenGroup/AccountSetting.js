import { AppBar, Container } from '@/Components'
import { Colors, XStyleSheet } from '@/Theme'
import React from 'react'
import { useTranslation } from 'react-i18next'

const AccountSetting = () => {
  const { t } = useTranslation()
  return (
    <Container safeAreaColor={Colors.white} style={styles.rootView}>
      <AppBar title={t('setting.account')} />
    </Container>
  )
}

export default AccountSetting

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.white,
  },
})
