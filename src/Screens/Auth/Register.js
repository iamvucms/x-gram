import {
  CameraSvg,
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
import { Colors, Layout, XStyleSheet } from '@/Theme'
import {
  getHitSlop,
  isAndroid,
  validateEmail,
  validateFullName,
  validatePassword,
} from '@/Utils'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StatusBar, TouchableOpacity, View } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, {
  FadeInLeft,
  FadeInRight,
  ZoomIn,
} from 'react-native-reanimated'

const RegisterScreen = () => {
  const { Images } = useAppTheme()
  const { t } = useTranslation()

  const state = useLocalObservable(() => ({
    avatar: null,
    showPassword: false,
    password: '',
    email: '',
    fullname: '',
    errorEmail: '',
    errorPassword: '',
    errorFullname: '',
    setAvatar: value => (state.avatar = value),
    setFullname: value => (state.fullname = value),
    setShowPassword: value => (state.showPassword = value),
    setPassword: value => (state.password = value),
    setEmail: value => (state.email = value),
    setErrorEmail: value => (state.errorEmail = value),
    setErrorPassword: value => (state.errorPassword = value),
    setErrorFullname: value => (state.errorFullname = value),
    get isValid() {
      return (
        !this.errorEmail &&
        !this.errorPassword &&
        !this.errorFullname &&
        this.email &&
        this.password &&
        this.fullname &&
        state.avatar
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

  const onFullnameChange = useCallback(value => {
    state.setFullname(value)
    state.setErrorFullname(validateFullName(value))
  }, [])

  const onAvatarPress = useCallback(async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
    })
    if (response?.assets?.[0]) {
      state.setAvatar(response.assets[0])
    }
  }, [])

  const onRegisterPress = useCallback(() => {}, [])

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
      <KeyboardAwareScrollView style={Layout.fill} enableOnAndroid>
        <TouchableOpacity
          onPress={() => appStore.setShowLanguageSheet(true)}
          style={styles.languagePicker}
        >
          <Row>
            <Obx>
              {() =>
                appStore.currentLanguage && (
                  <AppText
                    fontWeight={700}
                    lineHeight={14}
                    color={Colors.black}
                  >
                    {appStore.currentLanguage.name}{' '}
                  </AppText>
                )
              }
            </Obx>
            <ChevronDownSvg size={12} />
          </Row>
        </TouchableOpacity>
        <Padding top={80} horizontal={26}>
          <AppGradientText
            colors={[Colors.kFF7A51, Colors.kFFDB5C]}
            fontSize={32}
            lineHeight={77}
            fontWeight={700}
            align="center"
          >
            {t('auth.register_title')}
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
          <TouchableOpacity onPress={onAvatarPress} style={styles.avatarField}>
            <CameraSvg color={Colors.primary} />
            <Obx>
              {() =>
                state.avatar && (
                  <Image
                    style={styles.avatarImg}
                    source={{
                      uri: state.avatar.uri,
                    }}
                  />
                )
              }
            </Obx>
          </TouchableOpacity>
          <View style={styles.textField}>
            <Obx>
              {() => (
                <AppInput
                  value={state.fullname}
                  onChangeText={onFullnameChange}
                  style={styles.input}
                  placeholderTextColor={Colors.placeholder}
                  placeholder={t('auth.fullname_placeholder')}
                />
              )}
            </Obx>
            <TouchableOpacity
              hitSlop={getHitSlop(20)}
              onPress={() => onFullnameChange('')}
            >
              <CircleCloseSvg size={18} />
            </TouchableOpacity>
          </View>
          <Obx>
            {() =>
              state.errorFullname && <ErrorLabel text={state.errorFullname} />
            }
          </Obx>
          <Padding bottom={20} />
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
          <Padding bottom={30} />
          <Obx>
            {() => (
              <AppButton
                disabled={!state.isValid}
                disabledBackgroundColor={Colors.disabled}
                radius={10}
                text={t('auth.signIn')}
                onPress={onRegisterPress}
                textProps={{
                  fontWeight: 700,
                  fontSize: 19,
                }}
                style={styles.registerBtn}
              />
            )}
          </Obx>
          <Padding top={20}>
            <AppText color={Colors.placeholder}>
              {t('auth.register_note')}
            </AppText>
          </Padding>
        </Padding>

        <Box row center paddingVertical={40}>
          <AppText color={Colors.placeholder}>
            {t('auth.already_have_account')}{' '}
          </AppText>
          <TouchableOpacity onPress={() => navigate(PageName.LoginScreen)}>
            <AppText fontWeight={700} color={Colors.primary}>
              {t('auth.login_here')}
            </AppText>
          </TouchableOpacity>
        </Box>
      </KeyboardAwareScrollView>
      <Image source={Images.blueBlur} style={styles.blueBlur} />
    </Container>
  )
}

export default RegisterScreen

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
  registerBtn: {
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
  blueBlur: {
    position: 'absolute',
    zIndex: -1,
    bottom: 0,
    right: 0,
  },
  avatarField: {
    height: 100,
    width: 100,
    backgroundColor: Colors.white50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 30,
    borderColor: Colors.primary,
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatarImg: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 99,
  },
})
