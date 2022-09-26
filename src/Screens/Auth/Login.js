import {
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
  Container,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { useAppTheme } from '@/Hooks'
import { appStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import { isAndroid, getHitSlop } from '@/Utils'
import { useLocalObservable } from 'mobx-react-lite'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StatusBar, TouchableOpacity, View } from 'react-native'
import Animated, {
  FadeInLeft,
  FadeInRight,
  SlideInLeft,
  SlideInRight,
  ZoomIn,
} from 'react-native-reanimated'

const LoginScreen = () => {
  const { Images } = useAppTheme()
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    showPassword: false,
    password: '',
    email: '',
    setShowPassword: value => (state.showPassword = value),
    setPassword: value => (state.password = value),
    setEmail: value => (state.email = value),
  }))
  return (
    <Container
      disableTop
      disableBottom
      statusBarProps={{
        barStyle: 'dark-content',
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
      <Padding top={158} horizontal={35}>
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
                value={state.email}
                onChangeText={email => state.setEmail(email)}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
                placeholder={t('auth.email_placeholder')}
              />
            )}
          </Obx>
          <TouchableOpacity
            hitSlop={getHitSlop(20)}
            onPress={() => state.setEmail('')}
          >
            <CircleCloseSvg size={18} />
          </TouchableOpacity>
        </View>
        <View style={styles.textField}>
          <Obx>
            {() => (
              <AppInput
                secureTextEntry={!state.showPassword}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
                placeholder={t('auth.password_placeholder')}
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
        <AppButton
          radius={10}
          text={t('auth.signIn')}
          textProps={{
            fontWeight: 700,
            fontSize: 19,
          }}
          style={styles.loginBtn}
        />
      </Padding>
      <Image source={Images.blueBlur} style={styles.blueBlur} />
    </Container>
  )
}

export default LoginScreen

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.background,
  },
  languagePicker: {
    position: 'absolute',
    zIndex: 99,
    right: 12,
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
    marginBottom: 20,
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
})
