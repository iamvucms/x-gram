import { fetchCountries } from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
export default class HomeStore {
  name = 'HomeStore'
  countries = []
  constructor() {
    makeAutoObservable(this)
    // makePersist(this, 'HOME_STORE', ['countries'])
    makePersistExcept(this, 'HOME_STORE', ['name'])
  }
  *fetchCountries() {
    const countries = yield fetchCountries()
    if (Array.isArray(countries)) {
      this.countries = countries
    }
  }
  resetCountries() {
    this.countries = []
  }
  get totalCountries() {
    return this.countries.length
  }
  get isHydrated() {
    return isHydrated(this)
  }
  async hydrateStore() {
    await hydrateStore(this)
  }
}
