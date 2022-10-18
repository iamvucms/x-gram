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
  const token = userStore.token

  return !token
    ? {
        ...commonHeader,
      }
    : {
        ...commonHeader,
        Cookie: `tk=${token}`,
      }
}
