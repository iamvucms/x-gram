import { fetchCountries } from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
export default class ExampleStore {
  countries = []
  constructor() {
    makeAutoObservable(this)
    // makePersist(this, 'ExampleStore', ['countries'])
    makePersistExcept(this, 'ExampleStore', ['name'])
  }
  //async action
  *fetchCountries() {
    const countries = yield fetchCountries()
    if (Array.isArray(countries)) {
      this.countries = countries
    }
  }
  //sync action
  resetCountries() {
    this.countries = []
  }
  //computed value
  get totalCountries() {
    return this.countries.length
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
