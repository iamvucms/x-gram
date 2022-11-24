import {
  CheckSvg,
  ChevronDownSvg,
  CircleCloseSvg,
  EyeOffSvg,
  EyeOnSvg,
} from '@/Assets/Svg'
import {
  AppButton,
  AppGradientText,
  AppInput,
  AppText,
  Box,
  Container,
  ErrorLabel,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { PageName } from '@/Config'
import { useAppTheme } from '@/Hooks'
import { navigate } from '@/Navigators'
import { appStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import { getHitSlop, isAndroid, validateEmail, validatePassword } from '@/Utils'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StatusBar, TouchableOpacity, View } from 'react-native'
import Animated, {
  FadeInLeft,
  FadeInRight,
  ZoomIn,
} from 'react-native-reanimated'

const LoginScreen = () => {
  const { Images } = useAppTheme()
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    showPassword: false,
    password: '',
    email: '',
    saveLogin: false,
    errorPassword: '',
    errorEmail: '',
    setShowPassword: value => (state.showPassword = value),
    setPassword: value => (state.password = value),
    setEmail: value => (state.email = value),
    setSaveLogin: value => (state.saveLogin = value),
    setErrorPassword: value => (state.errorPassword = value),
    setErrorEmail: value => (state.errorEmail = value),
    get isValid() {
      return (
        !this.errorEmail && !this.errorPassword && this.email && this.password
      )
    },
  }))

  const onEmailChange = useCallback(value => {
    state.setEmail(value)
    state.setErrorEmail(validateEmail(value))
  }, [])

  const onPasswordChange = useCallback(value => {
    state.setPassword(value)
    state.setErrorPassword(validatePassword(value))
  }, [])

  const onLoginPress = useCallback(() => {}, [])

  const onLoginWithGooglePress = useCallback(async () => {
    try {
      if (isAndroid) {
        GoogleSignin.configure({
          scopes: ['profile', 'email'],
        })
      }
      const response = await GoogleSignin.signIn()
      const token = await GoogleSignin.getTokens()
      const user = {
        ...response.user,
        token: token.accessToken,
      }
      console.log(user)
    } catch (e) {
      console.log(JSON.stringify(e))
    }
  }, [])

  return (
    <Container
      disableTop
      disableBottom
      statusBarProps={{
        barStyle: 'dark-content',
        translucent: true,
      }}
      style={styles.rootView}
    >
      <TouchableOpacity
        onPress={() => appStore.setShowLanguageSheet(true)}
        style={styles.languagePicker}
      >
        <Row>
          <Obx>
            {() =>
              appStore.currentLanguage && (
                <AppText fontWeight={700} lineHeight={14} color={Colors.black}>
                  {appStore.currentLanguage.name}{' '}
                </AppText>
              )
            }
          </Obx>
          <ChevronDownSvg size={12} />
        </Row>
      </TouchableOpacity>
      <Padding top={158} horizontal={26}>
        <AppGradientText
          colors={[Colors.kFF7A51, Colors.kFFDB5C]}
          fontSize={32}
          lineHeight={77}
          fontWeight={700}
          align="center"
        >
          {t('auth.login_title')}
        </AppGradientText>
        <Row justify="center">
          <Animated.View
            style={styles.separatorLine}
            entering={FadeInLeft.delay(1000)}
          />
          <Padding horizontal={12}>
            <Animated.View
              style={styles.separatorLineDot}
              entering={ZoomIn.delay(1500)}
            />
          </Padding>
          <Animated.View
            style={styles.separatorLine}
            entering={FadeInRight.delay(1000)}
          />
        </Row>
        <Padding top={30} />
        <View style={styles.textField}>
          <Obx>
            {() => (
              <AppInput
                keyboardType="email-address"
                value={state.email}
                onChangeText={onEmailChange}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
                placeholder={t('auth.email_placeholder')}
              />
            )}
          </Obx>
          <TouchableOpacity
            hitSlop={getHitSlop(20)}
            onPress={() => onEmailChange('')}
          >
            <CircleCloseSvg size={18} />
          </TouchableOpacity>
        </View>
        <Obx>
          {() => state.errorEmail && <ErrorLabel text={state.errorEmail} />}
        </Obx>
        <Padding bottom={20} />
        <View style={styles.textField}>
          <Obx>
            {() => (
              <AppInput
                secureTextEntry={!state.showPassword}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
                placeholder={t('auth.password_placeholder')}
                value={state.password}
                onChangeText={onPasswordChange}
              />
            )}
          </Obx>
          <TouchableOpacity
            hitSlop={getHitSlop(20)}
            onPress={() => state.setShowPassword(!state.showPassword)}
          >
            <Obx>
              {() =>
                state.showPassword ? (
                  <EyeOnSvg size={18} />
                ) : (
                  <EyeOffSvg size={18} />
                )
              }
            </Obx>
          </TouchableOpacity>
        </View>
        <Obx>
          {() =>
            state.errorPassword && <ErrorLabel text={state.errorPassword} />
          }
        </Obx>
        <Padding bottom={20} />
        <TouchableOpacity
          onPress={() => navigate(PageName.RecoveryPasswordScreen)}
          style={styles.recoveryBtn}
          hitSlop={getHitSlop(10)}
        >
          <AppText color={Colors.placeholder}>
            {t('auth.recover_password')}
          </AppText>
        </TouchableOpacity>
        <Padding bottom={30} />
        <Obx>
          {() => (
            <AppButton
              disabled={!state.isValid}
              disabledBackgroundColor={Colors.disabled}
              radius={10}
              text={t('auth.signIn')}
              textWeight={700}
              textSize={19}
              onPress={onLoginPress}
              style={styles.loginBtn}
            />
          )}
        </Obx>
        <Obx>
          {() => (
            <TouchableOpacity
              onPress={() => state.setSaveLogin(!state.saveLogin)}
              style={styles.saveLoginBtn}
            >
              <Box
                radius={8}
                backgroundColor={state.saveLogin ? Colors.primary : Colors.gray}
                size={20}
                marginRight={10}
                center
              >
                <CheckSvg color={Colors.white} size={12} />
              </Box>
              <AppText
                color={state.saveLogin ? Colors.black : Colors.black50}
                lineHeight={14}
              >
                {t('auth.save_login')}
              </AppText>
            </TouchableOpacity>
          )}
        </Obx>
        <Box row center paddingTop={30}>
          <Box height={1} width={80} backgroundColor={Colors.kDFDFDF} />
          <Padding horizontal={17}>
            <AppText lineHeight={14} color={Colors.placeholder}>
              {t('auth.or_continue_with')}
            </AppText>
          </Padding>
          <Box height={1} width={80} backgroundColor={Colors.kDFDFDF} />
        </Box>
        <Padding top={30} />
        <TouchableOpacity
          onPress={onLoginWithGooglePress}
          activeOpacity={0.8}
          style={styles.googleBtn}
        >
          <AppText fontWeight={700} color={Colors.placeholder}>
            {t('auth.login_with_google')}
          </AppText>
          <Image style={styles.icGoogle} source={Images.icGoogle} />
        </TouchableOpacity>
      </Padding>
      <Box row center fill>
        <AppText color={Colors.placeholder}>
          {t('auth.dont_have_account')}{' '}
        </AppText>
        <TouchableOpacity onPress={() => navigate(PageName.RegisterScreen)}>
          <AppText fontWeight={700} color={Colors.primary}>
            {t('auth.register_here')}
          </AppText>
        </TouchableOpacity>
      </Box>
      <Image source={Images.blueBlur} style={styles.blueBlur} />
    </Container>
  )
}

export default LoginScreen

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  languagePicker: {
    position: 'absolute',
    zIndex: 99,
    right: 26,
    top: StatusBar.currentHeight + (isAndroid ? 10 : 0),
  },
  blurView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  textField: {
    height: 60,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    paddingRight: 10,
    fontSize: 16,
  },
  loginBtn: {
    height: 60,
  },
  separatorLine: {
    height: 2,
    width: 100,
    backgroundColor: Colors.kFF7A51,
  },
  separatorLineDot: {
    height: 6,
    width: 6,
    borderRadius: 99,
    backgroundColor: Colors.kFF7A51,
  },
  recoveryBtn: {
    alignSelf: 'flex-end',
  },
  blueBlur: {
    position: 'absolute',
    zIndex: -1,
    bottom: 0,
    right: 0,
  },
  googleBtn: {
    height: 60,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  icGoogle: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 20,
  },
  saveLoginBtn: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
