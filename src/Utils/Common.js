import { ResponsiveWidth } from '@/Theme'

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
