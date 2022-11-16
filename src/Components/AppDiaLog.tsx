import { CloseSvg } from '@/Assets/Svg'
import { AppButton } from '@/Components'
import {
  Colors,
  Layout,
  ResponsiveHeight,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { isAndroid } from '@/Utils'
import { BlurView } from '@react-native-community/blur'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { AppButtonProps } from './AppButton'
import AppText from './AppText'
import Padding from './Padding'
interface AppDialogProps {
  title?: string
  message?: string
  dialogIcon?: ImageSourcePropType | React.FC
  titleColor?: string
  messageColor?: string
  messageStyle?: TextStyle
  customMessage?: React.ReactNode
  showCancelButton?: boolean
  buttonText?: string
  buttonProps?: AppButtonProps
  buttonCustom?: React.ReactNode
  showTime?: number
  footer?: React.ReactNode
  hideCloseButton?: boolean
  backdropForClosing?: boolean
  onClose: () => void
  onPress: () => void
}
const AppDialog = ({
  onClose,
  onPress,
  title,
  message,
  messageStyle,
  customMessage,
  dialogIcon,
  titleColor,
  buttonText,
  buttonProps,
  buttonCustom,
  showTime,
  footer,
  hideCloseButton = false,
  messageColor,
  backdropForClosing,
  showCancelButton = false,
}: AppDialogProps) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (showTime) {
      const action = setTimeout(() => {
        onClose()
      }, showTime)
      return () => clearTimeout(action)
    }
  }, [])
  return (
    <Modal
      statusBarTranslucent={isAndroid}
      animationType="fade"
      transparent
      visible
    >
      <View style={styles.rootContainer}>
        <Pressable
          disabled={!backdropForClosing}
          onPress={onClose}
          style={styles.blurView}
        >
          <BlurView blurRadius={2} blurType="dark" style={Layout.fill} />
        </Pressable>
        <Animated.View entering={SlideInDown} style={styles.container}>
          {!hideCloseButton && (
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseSvg size={30} />
            </TouchableOpacity>
          )}
          {typeof dialogIcon === 'number' ? (
            <FastImage
              source={dialogIcon}
              style={[
                styles.dialogIcon,
                {
                  width: ResponsiveHeight(80),
                  height: ResponsiveHeight(80),
                },
              ]}
            />
          ) : (
            typeof dialogIcon === 'function' && (
              <View style={styles.dialogIcon}>{dialogIcon({})}</View>
            )
          )}
          {!!title && (
            <AppText
              fontWeight={700}
              color={titleColor || Colors.primary}
              style={styles.titleTxt}
            >
              {t(title as any)}
            </AppText>
          )}
          {!!message && (
            <AppText
              color={messageColor || Colors.placeholder}
              style={[styles.messageTxt, messageStyle]}
            >
              {t(message as any)}
            </AppText>
          )}
          {!!customMessage && customMessage}
          {footer}
          {!!buttonText && (
            <View style={styles.footerContainer}>
              {showCancelButton && (
                <>
                  <AppButton
                    onPress={onClose}
                    style={styles.mainBtn}
                    textStyle={styles.mainBtnTxt}
                    backgroundColor={Colors.black50}
                    text={t('cancel')}
                  />
                  <Padding left={12} />
                </>
              )}
              <AppButton
                {...buttonProps}
                onPress={onPress}
                style={styles.mainBtn}
                textStyle={styles.mainBtnTxt}
                backgroundColor={Colors.primary}
                text={t(buttonText as any)}
              />
            </View>
          )}
          {!!buttonCustom && buttonCustom}
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = XStyleSheet.create({
  dialogIcon: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: 16,
  },
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 0.9 * screenWidth,
    justifyContent: 'flex-end',
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.k1D1E22,
    padding: 16,
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
  },
  mainBtn: {
    flex: 1,
  },
  mainBtnTxt: {
    color: Colors.white,
    fontSize: 16,
  },
  titleTxt: {
    fontSize: 19,
    textAlign: 'center',
    marginTop: 12,
  },
  messageTxt: {
    fontSize: 13,
    marginTop: 8,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  iconClose: {
    width: 22,
    height: 22,
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  blurView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
})
export default memo(AppDialog)
