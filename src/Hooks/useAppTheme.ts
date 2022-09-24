import { getAppTheme } from '@/Theme'
import { ImageSourcePropType, useColorScheme } from 'react-native'

export default function () {
  const theme = useColorScheme()
  const isDark = theme === 'dark'
  return mergeAppTheme(isDark, getAppTheme())
}

const mergeAppTheme = (
  isDark: boolean,
  theme: ReturnType<typeof getAppTheme>,
) => {
  type ImageKey =
    | keyof typeof theme.default.Images
    | keyof typeof theme.dark.Images
  type ColorKey =
    | keyof typeof theme.default.Colors
    | keyof typeof theme.dark.Colors

  const primaryTheme = isDark ? theme.dark : theme.default
  const secondaryTheme = isDark ? theme.default : theme.dark
  const mergedColors: { [key in ColorKey]: ImageSourcePropType } = {
    ...secondaryTheme.Colors,
    ...primaryTheme.Colors,
  } as any
  const mergedImages: { [key in ImageKey]: ImageSourcePropType } = {
    ...secondaryTheme.Images,
    ...primaryTheme.Images,
  } as any
  return {
    ...primaryTheme,
    Colors: mergedColors,
    Images: mergedImages,
  }
}
