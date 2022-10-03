import { LockSvg } from '@/Assets/Svg'
import {
  AppInput,
  AppText,
  Box,
  Container,
  ErrorLabel,
  Keyboard,
  Obx,
  Padding,
} from '@/Components'
import { PageName } from '@/Config'
import { navigateAndReset } from '@/Navigators'
import { userStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import { useLocalObservable } from 'mobx-react-lite'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

const AuthPassCodeScreen = () => {
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    passcode: '',
    passcodeError: '',
    setPasscode: value => (state.passcode = value),
    setPasscodeError: value => (state.passcodeError = value),
  }))

  const onKeyPress = value => {
    if (state.passcode.length >= 6) {
      return
    }
    console.log(userStore.passcode)
    state.setPasscodeError('')
    state.setPasscode(state.passcode + value)
    if (state.passcode.length === 6) {
      if (state.passcode === userStore.passcode) {
        state.setPasscodeError('')
        navigateAndReset([PageName.AuthStack], 0)
      } else {
        state.setPasscodeError(t('auth.passcode_error'))
      }
    }
  }

  const onDel = () => {
    state.setPasscodeError('')
    state.setPasscode(state.passcode.slice(0, -1))
  }

  const onFingerPrint = async () => {
    const rnBiometrics = new ReactNativeBiometrics()
    const { biometryType } = await rnBiometrics.isSensorAvailable()
    if (biometryType === BiometryTypes.Biometrics) {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: t('auth.passlock_description'),
      })
      if (success) {
        navigateAndReset([PageName.AuthStack], 0)
      }
    }
  }

  return (
    <Container style={styles.rootView}>
      <Box fill center>
        <LockSvg size={50} />
        <Padding top={25} />
        <AppText fontSize={16}>{t('auth.passlock_title')}</AppText>
        <Padding top={50} />
        <Obx>
          {() => (
            <AppInput
              fontSize={20}
              fontWeight={700}
              secureTextEntry
              value={state.passcode}
            />
          )}
        </Obx>
        <Obx>
          {() =>
            !!state.passcodeError && <ErrorLabel text={state.passcodeError} />
          }
        </Obx>
      </Box>
      <Keyboard
        onRequestBioMetric={onFingerPrint}
        onPress={onKeyPress}
        onDel={onDel}
      />
    </Container>
  )
}

export default AuthPassCodeScreen

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.white,
  },
})
