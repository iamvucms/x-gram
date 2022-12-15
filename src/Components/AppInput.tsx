import { StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native'
import React, { forwardRef, memo } from 'react'
import {
  AppFonts,
  Colors,
  FontSizes,
  ResponsiveFont,
  ResponsiveHeight,
  XStyleSheet,
} from '@/Theme'
import { isAndroid } from '@/Utils'

export interface AppInputProps extends TextInputProps {
  fontWeight?: keyof typeof AppFonts | string
  fontSize?: number | keyof typeof FontSizes
  color?: string
  lineHeightRatio?: number
  lineHeight?: number
  style?: StyleProp<TextStyle>
  align?: 'left' | 'center' | 'right'
  useDefaultFont?: boolean
}

const AppInput = forwardRef(
  (
    {
      fontWeight = 400,
      fontSize = 'normal',
      color = Colors.typography,
      placeholderTextColor = Colors.placeholder,
      lineHeightRatio,
      lineHeight,
      style,
      align = 'left',
      useDefaultFont = false,
      ...restProps
    }: AppInputProps,
    ref: React.LegacyRef<TextInput>,
  ) => {
    const size = typeof fontSize === 'string' ? FontSizes[fontSize] : fontSize
    const textStyles = {
      fontFamily: useDefaultFont
        ? undefined
        : typeof fontWeight === 'string'
        ? fontWeight
        : AppFonts[fontWeight],
      color,
      fontSize: ResponsiveFont(size),
      ...(lineHeightRatio && {
        lineHeight: ResponsiveHeight(size * lineHeightRatio),
      }),
      ...(lineHeight && { lineHeight: ResponsiveHeight(lineHeight) }),
      textAlign: align,
    }
    return (
      <TextInput
        ref={ref}
        style={[styles.base, textStyles, style]}
        placeholderTextColor={placeholderTextColor}
        {...restProps}
      />
    )
  },
)

export default memo(AppInput)

const styles = XStyleSheet.create({
  base: {
    color: Colors.typography,
    ...(isAndroid && {
      marginVertical: -15,
    }),
    skipResponsive: true,
  },
})
