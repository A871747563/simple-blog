// 评论功能接口
import axios from 'axios'
// 一言接口配置
import { AwordConfig } from 'api/interface/Aword.js' // 请求api

const AwordService = axios.create({
  timeout: 3000 // 超时设置
})
// axios请求拦截器
AwordService.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// axios响应拦截器
AwordService.interceptors.response.use(
  (res) => {
    // console.log('响应拦截器')
    return res
  },
  (err) => {
    return Promise.reject(err)
  }
)

export const AwordAxios = () => {
  return AwordService.request({ ...AwordConfig })
}
