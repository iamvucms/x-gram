import { getImages } from '@/Assets/Images'
import i18n from '@/Translations/i18n'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
export default class AppStore {
  languagues = [
    {
      name: 'English',
      code: 'en',
      flag: getImages().english_flag,
      isSelected: i18n.language === 'en',
    },
    {
      name: 'Tiếng Việt',
      code: 'vi',
      flag: getImages().vietnamese_flag,
      isSelected: i18n.language === 'vi',
    },
  ]
  showLanguageSheet = false

  constructor() {
    makeAutoObservable(this)
    // makePersist(this, 'AppStore', ['countries'])
    makePersistExcept(this, 'AppStore', ['showLanguageSheet'])
  }

  setLanguage(code) {
    i18n.changeLanguage(code)
    this.languagues.forEach(lang => {
      lang.isSelected = lang?.code === code
    })
  }

  setShowLanguageSheet(value) {
    this.showLanguageSheet = value
  }

  get currentLanguage() {
    return this.languagues.find(lang => lang.isSelected)
  }
  // check for hydration (required)
  get isHydrated() {
    return isHydrated(this)
  }
  // hydrate the store (required)
  async hydrateStore() {
    await hydrateStore(this)
  }
}
