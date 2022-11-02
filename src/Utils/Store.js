import { makePersistable } from 'mobx-persist-store'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()
const maskStorage = {
  setItem: (key, data) => storage.set(key, data),
  getItem: key => storage.getString(key),
  removeItem: key => storage.delete(key),
}

export const makePersist = (context, storeName, properties = []) => {
  makePersistable(context, {
    name: storeName,
    properties,
    storage: maskStorage,
  })
}

export const makePersistExcept = (context, storeName, properties = []) => {
  const persistProps = Object.keys(context).filter(k => !properties.includes(k))
  makePersistable(context, {
    name: storeName,
    properties: persistProps,
    storage: maskStorage,
  })
}
