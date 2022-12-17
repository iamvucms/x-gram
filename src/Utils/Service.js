import { Config } from '@/Config'
import { userStore } from '@/Stores'
import { Platform } from 'react-native'

const commonHeader = {
  os: Platform.OS,
  device: 'Mobile',
  browser: 'Chrome',
  'User-Agent': Config.USER_AGENT,
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export const generateHeader = () => {
  const cookie = userStore.cookie

  return !cookie
    ? {
        ...commonHeader,
      }
    : {
        ...commonHeader,
        Cookie: cookie,
      }
}
