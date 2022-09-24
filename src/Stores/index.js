import HomeStore from './HomeStore'
import UserStore from './UserStore'
import DiaLogStore from './DiaLogStore'
export const homeStore = new HomeStore()
export const userStore = new UserStore()
export const diaLogStore = new DiaLogStore()

//Add Persist Store here
const persistStores = [homeStore, userStore]

export const rehydrateStore = async () =>
  await Promise.all(
    persistStores.map(async store => await store?.hydrateStore?.()),
  )
