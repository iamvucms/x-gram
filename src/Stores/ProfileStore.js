import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
export default class ProfileStore {
  profileInfo = {}
  fetching = false
  constructor() {
    makeAutoObservable(this)
  }
  *fetchProfile(userId) {
    this.fetching = true
    // fetch profile
    this.fetching = false
  }
  get isHydrated() {
    return isHydrated(this)
  }
  // hydrate the store (required)
  async hydrateStore() {
    await hydrateStore(this)
  }
}
