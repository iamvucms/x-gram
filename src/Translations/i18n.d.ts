import * as resources from './Resources'
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en'
    resources: {
      vi: typeof resources.vi
      en: typeof resources.en
    }
  }
}
