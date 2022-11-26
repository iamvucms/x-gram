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

export const compareTwoStringArray = (arr1, arr2) => {
  arr1 = arr1.sort()
  arr2 = arr2.sort()
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i += 1) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}
