import {
  Layout,
  moderateScale,
  ResponsiveHeight,
  ResponsiveWidth,
} from '@/Theme'
import React, { forwardRef, memo } from 'react'
import { StyleProp, View, ViewProps } from 'react-native'

interface BoxProps {
  children?: React.ReactNode
  fill?: boolean
  flex?: number
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  backgroundColor?: string
  alignSelf?:
    | 'auto'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'baseline'
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  reverse?: boolean
  row?: boolean
  center?: boolean
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  padding?: number
  paddingHorizontal?: number
  paddingVertical?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  marginTop?: number
  margin?: number
  marginHorizontal?: number
  marginVertical?: number
  height?: number | string
  width?: number | string
  size?: number
  maxHeight?: number | string
  maxWidth?: number | string
  radius?: number
  topLeftRadius?: number
  topRightRadius?: number
  bottomLeftRadius?: number
  bottomRightRadius?: number
  overflow?: 'visible' | 'hidden' | 'scroll'
  style?: StyleProp<ViewProps>
}

const Box = forwardRef(
  (
    {
      children,
      fill,
      flex,
      align,
      flexWrap,
      justify,
      center,
      reverse,
      alignSelf,
      row,
      style,
      padding,
      paddingBottom,
      paddingHorizontal,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingVertical,
      margin,
      marginBottom,
      marginHorizontal,
      marginLeft,
      marginRight,
      marginTop,
      marginVertical,
      backgroundColor,
      height,
      maxHeight,
      maxWidth,
      width,
      size,
      radius,
      topLeftRadius,
      topRightRadius,
      bottomLeftRadius,
      bottomRightRadius,
      overflow,
      ...restProps
    }: BoxProps,
    ref: React.ForwardedRef<View>,
  ) => {
    return (
      <View
        {...restProps}
        ref={ref}
        style={[
          style,
          row
            ? reverse
              ? Layout.rowReverse
              : Layout.row
            : reverse
            ? Layout.columnReverse
            : Layout.column,
          center && Layout.center,
          fill && Layout.fill,
          flex && { flex },
          (height || size) && {
            height: size
              ? moderateScale(size)
              : typeof height === 'string'
              ? height
              : ResponsiveHeight(height),
          },
          (width || size) && {
            width: size
              ? moderateScale(size)
              : typeof width === 'string'
              ? width
              : ResponsiveWidth(width),
          },
          maxHeight && {
            maxHeight:
              typeof maxHeight === 'string'
                ? maxHeight
                : ResponsiveHeight(maxHeight),
          },
          maxWidth && {
            maxWidth:
              typeof maxWidth === 'string'
                ? maxWidth
                : ResponsiveWidth(maxWidth),
          },
          backgroundColor && { backgroundColor },
          align && { alignItems: align },
          justify && { justifyContent: justify },
          alignSelf && { alignSelf },
          flexWrap && { flexWrap },
          radius && { borderRadius: moderateScale(radius) },
          overflow && { overflow },
          topLeftRadius && {
            borderTopLeftRadius: moderateScale(topLeftRadius),
          },
          topRightRadius && {
            borderTopRightRadius: moderateScale(topRightRadius),
          },
          bottomLeftRadius && {
            borderBottomLeftRadius: moderateScale(bottomLeftRadius),
          },
          bottomRightRadius && {
            borderBottomRightRadius: moderateScale(bottomRightRadius),
          },
          paddingBottom && {
            paddingBottom: ResponsiveHeight(paddingBottom),
          },
          paddingLeft && { paddingLeft: ResponsiveWidth(paddingLeft) },
          paddingRight && { paddingRight: ResponsiveWidth(paddingRight) },
          paddingTop && { paddingTop: ResponsiveHeight(paddingTop) },
          padding && { padding: moderateScale(padding) },
          paddingHorizontal && {
            paddingHorizontal: ResponsiveWidth(paddingHorizontal),
          },
          paddingVertical && {
            paddingVertical: ResponsiveHeight(paddingVertical),
          },
          marginBottom && { marginBottom: ResponsiveHeight(marginBottom) },
          marginLeft && { marginLeft: ResponsiveWidth(marginLeft) },
          marginRight && { marginRight: ResponsiveWidth(marginRight) },
          marginTop && { marginTop: ResponsiveHeight(marginTop) },
          margin && { margin: moderateScale(margin) },
          marginHorizontal && {
            marginHorizontal: ResponsiveWidth(marginHorizontal),
          },
          marginVertical && {
            marginVertical: ResponsiveHeight(marginVertical),
          },
        ]}
      >
        {children}
      </View>
    )
  },
)

export default memo(Box)
