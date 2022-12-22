import { userStore } from '@/Stores'
import { generateHeader } from '@/Utils'
import axios from 'axios'

const API = axios.create({
  timeout: 10000,
})

// Handle Cookie manualy in header of request
API.defaults.withCredentials = false

API.interceptors.request.use(
  config => {
    config.headers = { ...config.headers, ...generateHeader() }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

API.interceptors.response.use(
  response => {
    return response
  },
  ({ message, response: { data, status } }) => {
    return Promise.reject({ message, data, status })
  },
)

export const request = async (url, method = Method.GET, data, onError) => {
  try {
    const response = await API[method](
      url,
      method === Method.GET ? { params: data } : data,
    )
    return response.data
  } catch (e) {
    onError && onError(e)
    handleError(e)
    // return {
    //   status: 'ERROR',
    //   message: e.message,
    // }
  }
}
export const uploadRequest = async (url, data, onError) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Cookie: userStore.cookie,
      },
    })
    return response.data
  } catch (e) {
    console.log('come', e)
    onError && onError(e)
    handleError(e)
  }
}
const handleError = error => {
  console.log(error)
}

export const Method = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  OPTIONS: 'options',
  HEAD: 'head',
  PATCH: 'patch',
}

export default API
