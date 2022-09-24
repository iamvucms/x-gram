import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native'
import React, { memo } from 'react'
import {
  AppFonts,
  Colors,
  FontSizes,
  ResponsiveFont,
  ResponsiveHeight,
} from '@/Theme'

export interface AppTextProps extends TextProps {
  children: React.ReactNode
  fontWeight?: keyof typeof AppFonts | string
  fontSize?: number | keyof typeof FontSizes
  color?: string
  lineHeightRatio?: number
  lineHeight?: number
  style?: StyleProp<TextStyle>
  align?: 'left' | 'center' | 'right'
  useDefaultFont?: boolean
}

const AppText = ({
  children,
  fontWeight = 400,
  fontSize = 'normal',
  color = Colors.black,
  lineHeightRatio,
  lineHeight,
  style,
  align = 'left',
  useDefaultFont = true, // update this line after linked fonts
  ...restProps
}: AppTextProps) => {
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
    <Text style={[styles.base, textStyles, style]} {...restProps}>
      {children}
    </Text>
  )
}

export default memo(AppText)

const styles = StyleSheet.create({
  base: {
    color: Colors.black,
  },
})
