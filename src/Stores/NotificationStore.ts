import { mockNotifications, Notification } from '@/Models'
import { getNotifications, deleteNotification } from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
import { diaLogStore } from '.'
export default class NotificationStore {
  notifications: Notification[] = []
  seenIds: { [key: string]: boolean } = {}

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
  *deleteNotification(id: string) {
    try {
      this.removeNotification(id)
      const response = yield deleteNotification(id)
      if (response.status !== 'OK') {
        diaLogStore.showErrorDiaLog()
        //
      }
    } catch (e) {
      diaLogStore.showErrorDiaLog()
      console.log({
        deleteNotification: e,
      })
    }
  }
  removeNotification(id: string) {
    this.notifications = this.notifications.filter(
      n => n.notification_id !== id,
    )
  }
  addSeenId(id: string) {
    this.seenIds[id] = true
  }
  removeSeenId(id: string) {
    delete this.seenIds[id]
  }
  markAllAsSeen() {
    this.notifications.forEach(n => {
      this.addSeenId(n.notification_id)
    })
  }
  getIsSeen(id: string) {
    return this.seenIds[id]
  }
  get isHydrated() {
    return isHydrated(this)
  }
  // hydrate the store (required)
  async hydrateStore() {
    await hydrateStore(this)
  }
}
