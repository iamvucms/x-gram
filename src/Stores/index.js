import HomeStore from './HomeStore'
import UserStore from './UserStore'
import DiaLogStore from './DiaLogStore'
import AppStore from './AppStore'
export const homeStore = new HomeStore()
export const userStore = new UserStore()
export const diaLogStore = new DiaLogStore()
export const appStore = new AppStore()
//Add Persist Store here
const persistStores = [homeStore, userStore, appStore]

export const rehydrateStore = async () =>
  await Promise.all(
    persistStores.map(async store => await store?.hydrateStore?.()),
  )
