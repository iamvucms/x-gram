import { Colors, DarkColors } from './Colors'
import { DefaultTheme, DarkTheme } from '@react-navigation/native'
import { getDarkImages, getImages } from '@/Assets/Images'
export const getAppTheme = () => ({
  default: {
    Colors,
    Images: getImages(),
    NavigationTheme: DefaultTheme,
  },
  dark: {
    Colors: DarkColors,
    Images: getDarkImages(),
    NavigationTheme: DarkTheme,
  },
})
