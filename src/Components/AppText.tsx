import { AppFonts, Colors, FontSizes, ResponsiveFont } from '@/Theme'
import React, { memo } from 'react'
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native'
import ParsedText, { ParsedTextProps } from 'react-native-parsed-text'

export interface AppTextProps extends TextProps, ParsedTextProps {
  children: React.ReactNode
  fontWeight?: keyof typeof AppFonts | string
  fontSize?: number | keyof typeof FontSizes
  color?: string
  lineHeightRatio?: number
  lineHeight?: number
  style?: StyleProp<TextStyle>
  align?: 'left' | 'center' | 'right'
  useDefaultFont?: boolean
  regexMetion?: boolean
  onMentionPress?: (username: string) => void
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
  useDefaultFont = false,
  regexMetion = false,
  onMentionPress,
  parse = [],
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
      lineHeight: ResponsiveFont(size * lineHeightRatio),
    }),
    ...(lineHeight && { lineHeight: ResponsiveFont(lineHeight) }),
    textAlign: align,
  }
  return Array.isArray(children) ? (
    <Text {...restProps} style={[styles.base, textStyles, style]}>
      {children.map((child, idx) => (
        <React.Fragment key={`${child}_${idx}`}>
          {typeof child === 'string' ? (
            <ParsedText
              {...restProps}
              style={[styles.base, textStyles, style]}
              parse={[
                ...(regexMetion
                  ? [
                      {
                        pattern: /@\w+/,
                        style: { color: Colors.primary },
                        onPress: user_id =>
                          onMentionPress && onMentionPress(user_id),
                      },
                    ]
                  : []),
                ...parse,
              ]}
            >
              {child}
            </ParsedText>
          ) : (
            child
          )}
        </React.Fragment>
      ))}
    </Text>
  ) : (
    <ParsedText
      {...restProps}
      style={[styles.base, textStyles, style]}
      parse={[
        ...(regexMetion
          ? [
              {
                pattern: /@\w+/,
                style: { color: Colors.primary },
                onPress: user_id => onMentionPress && onMentionPress(user_id),
              },
            ]
          : []),
        ...parse,
      ]}
    >
      {children}
    </ParsedText>
  )
}

export default memo(AppText)

const styles = StyleSheet.create({
  base: {
    color: Colors.black,
  },
})
