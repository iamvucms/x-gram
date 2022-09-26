import { moderateScale, ResponsiveWidth } from '@/Theme'

export const randomRgb = () => {
  const o = Math.round,
    r = Math.random,
    s = 255
  return `rgb(${o(r() * s)},${o(r() * s)},${o(r() * s)})`
}

export const caculatePageWidthForPagination = (
  sliderWidth,
  itemWidth,
  itemLength,
  marginHorizontal,
) =>
  itemLength <= 1
    ? 0
    : (itemWidth * itemLength -
        sliderWidth +
        ResponsiveWidth(marginHorizontal) * 2) /
      (itemLength - 1)

export const getHitSlop = (size = 20) => ({
  top: moderateScale(size),
  bottom: moderateScale(size),
  left: moderateScale(size),
  right: moderateScale(size),
})
