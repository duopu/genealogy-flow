import axios, { type AxiosInstance } from 'axios'

import { message } from 'ant-design-vue'

const services: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3050/',
  timeout: 100_000
  // withCredentials: true // 允许携带cookie
})

export const $get = (url: string, params: any, otherParams = {}) =>
  services({ url, method: 'get', params, ...otherParams })
export const $post = (url: string, data: any, otherParams = {}) =>
  services({ url, method: 'post', data, ...otherParams })

services.interceptors.request.use(
  (config) => {
    console.log('Vuex?.getters?.inIframe', config)

    return config
  },
  () => {
    message.error('加载超时')
    return Promise.reject()
  }
)

services.interceptors.response.use(
  (response) => {
    const { status: httpStatus /* http状态码*/, data } = response

    console.log('response', response)

    return new Promise((resolve, reject) => {
      const { code /* 业务状态码 */, requestId, message } = data

      resolve(data) // 正常的返回
    })
  },
  (error) => {
    const { request, data } = error
    console.log('error', error)

    return Promise.reject(error)
  }
)
export default services
