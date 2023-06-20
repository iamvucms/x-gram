export { PageName } from './PageName'
export const EnvType = {
  STG: 0,
  DEV: 1,
  PROD: 2,
  GIT: 3,
}
export const APP_ENV = EnvType.DEV

export const CommonConfig = {
  ...ProdConfig,
}

export const StgConfig = {
  API_URL: '',
  BASE_URL: '',
  BASE_API: '',
  SOCKET_URL: '',
}
export const DevConfig = {
  API_URL: 'http://172.20.10.3:3000',
  BASE_URL: 'http://172.20.10.3:3000',
  BASE_API: 'http://172.20.10.3:3000',
  SOCKET_URL: 'http://172.20.10.3:3000',
}
export const ProdConfig = {
  API_URL: '',
  BASE_URL: '',
  BASE_API: '',
  SOCKET_URL: '',
}
//Mixed Config
export const Config = {
  ...CommonConfig,
  ...(APP_ENV === EnvType.DEV && DevConfig),
  ...(APP_ENV === EnvType.STG && StgConfig),
  ...(APP_ENV === EnvType.PROD && ProdConfig),
}
