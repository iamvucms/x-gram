import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
import { makePersistExcept } from './StoreUtils'
export default class UserStore {
  isLogged = false
  userInfo = {}
  constructor() {
    makeAutoObservable(this)
    makePersistExcept(this, 'UserStore', [])
  }
  setUserInfo(userInfo) {
    this.userInfo = userInfo
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
