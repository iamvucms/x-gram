export { PageName } from './PageName'
export const EnvType = {
  STG: 0,
  DEV: 1,
  PROD: 2,
  GIT: 3,
}
export const APP_ENV = EnvType.PROD

export const CommonConfig = {
  ...ProdConfig,
  GIT_CONFIG_URL: '',
  USER_AGENT:
    'Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/96.0.4664.93 Mobile/15E148 Safari/604.1',
  CHAT_URL: '',
  telegram: 'https://t.me/',
  messenger: 'https://m.me/',
  gglink: 'https://www.google.com/',
  BASE_URL_IPV4: 'https://api.ipify.org/?format=string',
  BASE_URL_IPV6: 'https://api6.ipify.org/?format=string',
  facebook: 'https://graph.facebook.com/facebook/picture?redirect=false',
}

export const StgConfig = {
  API_URL: '',
  BASE_URL: '',
  BASE_API: '',
  SOCKET_URL: '',
  BASE_URL_EVENT: '',
}
export const DevConfig = {
  API_URL: '',
  BASE_URL: '',
  BASE_API: '',
  SOCKET_URL: '',
  BASE_URL_EVENT: '',
}
export const ProdConfig = {
  API_URL: '',
  BASE_URL: '',
  BASE_API: '',
  SOCKET_URL: '',
  BASE_URL_EVENT: '',
}
//Mixed Config
export const Config = {
  ...CommonConfig,
  ...(APP_ENV === EnvType.DEV && DevConfig),
  ...(APP_ENV === EnvType.STG && StgConfig),
  ...(APP_ENV === EnvType.PROD && ProdConfig),
}
