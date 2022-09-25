import { Colors, ResponsiveWidth, XStyleSheet } from '@/Theme'
import React, { memo } from 'react'
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import AppText, { AppTextProps } from './AppText'
import Padding from './Padding'
export interface AppButtonProps {
  text?: string
  icon?: ImageSourcePropType
  svgIcon?: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  backgroundColor?: string
  colors?: (string | number)[]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  disabledBackgroundColor?: string
  disabledTextColor?: string
  textColor?: string
  textStyle?: StyleProp<TextStyle>
  iconStyle?: StyleProp<ImageStyle>
  opacity?: number
  iconDirection?: 'left' | 'right'
  textProps?: Omit<AppTextProps, 'children'>
  style?: StyleProp<ViewStyle> | ViewStyle
  radius?: number
  spaceBetween?: number
  shadowColor?: string
  shadowOpacity?: number
  shadowSize?: number
  center?: boolean
}
const AppButton = ({
  radius = 8,
  backgroundColor = Colors.primary,
  colors,
  disabled,
  disabledBackgroundColor = Colors.gray,
  disabledTextColor = Colors.white,
  icon,
  svgIcon,
  iconStyle,
  onPress,
  opacity = 0.8,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  text,
  textStyle,
  iconDirection = 'right',
  textColor = Colors.white,
  style,
  spaceBetween = 10,
  center = true,
  textProps: { style: extraTextStyle, ...restTextProps } = {},
  ...restProps
}: AppButtonProps) => {
  const styles = XStyleSheet.create({
    baseBtn: {
      flexDirection: iconDirection === 'right' ? 'row' : 'column-reverse',
      alignItems: 'center',
      justifyContent: center ? 'center' : 'flex-start',
      paddingHorizontal: 16,
      height: 44,
      borderRadius: radius,
      backgroundColor: disabled ? disabledBackgroundColor : backgroundColor,
      overflow: 'hidden',
    },
    baseTxt: {
      color: disabled ? disabledTextColor : textColor,
    },
    btnBg: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
    },
    baseIc: {
      height: 24,
      width: 24,
    },
  })
  return (
    <TouchableOpacity
      {...restProps}
      disabled={disabled}
      style={[styles.baseBtn, style]}
      activeOpacity={opacity}
      onPress={onPress}
    >
      {!!colors && (
        <LinearGradient
          style={styles.btnBg}
          colors={
            disabled
              ? [disabledBackgroundColor, disabledBackgroundColor]
              : colors
          }
          start={start}
          end={end}
        />
      )}
      <AppText
        {...restTextProps}
        style={[styles.baseTxt, textStyle, extraTextStyle]}
      >
        {text}
      </AppText>
      {(!!icon || !!svgIcon) && (
        <>
          <Padding left={ResponsiveWidth(spaceBetween)} />
          {!!svgIcon ? (
            svgIcon
          ) : (
            <Image source={icon} style={[styles.baseIc, iconStyle]} />
          )}
        </>
      )}
    </TouchableOpacity>
  )
}

export default memo(AppButton)
