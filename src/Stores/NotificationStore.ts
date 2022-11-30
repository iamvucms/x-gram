import { mockNotifications, Notification } from '@/Models'
import { getNotifications } from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
export default class NotificationStore {
  notifications: Notification[] = []
  seenIds: { [key: string]: boolean } = {}
  hiddenIds: { [key: string]: boolean } = {}
  constructor() {
    makeAutoObservable(this)
    makePersistExcept(this, 'NotificationStore', [])
  }
  *fetchNotifcations() {
    try {
      const { data } = yield getNotifications()
      this.notifications = data
    } catch (e) {
      this.notifications = mockNotifications as Notification[]
      console.log({
        fetchNotifcations: e,
      })
    }
  }
  addSeenId(id: string) {
    this.seenIds[id] = true
  }
  removeSeenId(id: string) {
    delete this.seenIds[id]
  }
  getIsSeen(id: string) {
    return this.seenIds[id]
  }
  getIsHidden(id: string) {
    return this.hiddenIds[id]
  }
  addHiddenId(id: string) {
    this.hiddenIds[id] = true
  }
  removeHiddenId(id: string) {
    delete this.hiddenIds[id]
  }
  get isHydrated() {
    return isHydrated(this)
  }
  // hydrate the store (required)
  async hydrateStore() {
    await hydrateStore(this)
  }
}
