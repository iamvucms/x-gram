import { uploadRequest } from '../Axios'
import Endpoint from '../Endpoint'

export const uploadImage = (uri, mimeType) => {
  const data = new FormData()
  data.append('image', {
    uri,
    name: 'image.jpg',
    type: mimeType,
  })
  return uploadRequest(Endpoint().uploadImage, data)
}

export const uploadVideo = (uri, mimeType) => {
  const data = new FormData()
  data.append('video', {
    uri,
    name: 'video.mp4',
    type: mimeType,
  })
  return uploadRequest(Endpoint().uploadVideo, data)
}
