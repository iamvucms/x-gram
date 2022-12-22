import { uploadRequest } from '../Axios'
import Endpoint from '../Endpoint'

export const uploadImage = (uri, mimeType) => {
  const data = new FormData()
  data.append('medias', {
    uri: uri.startsWith('file://') ? uri : `file://${uri}`,
    name: uri.split('/').pop(),
    type: mimeType,
  })
  return uploadRequest(Endpoint().upload, data)
}

export const uploadVideo = (uri, mimeType) => {
  const data = new FormData()
  data.append('medias', {
    uri,
    name: 'video.mp4',
    type: mimeType,
  })
  return uploadRequest(Endpoint().upload, data)
}
