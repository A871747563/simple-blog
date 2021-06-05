// 评论功能接口
import axios from 'axios'
import { gettingCK } from 'utils/cookie-util'
import { editGeneralConfig, editPasswordConfig } from 'api/interface/editInfo.js' // 请求api
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
NProgress.configure({ ease: 'ease', speed: 1000 }) // 调整动画设置
NProgress.configure({ minimum: 0.5 }) // 设置最低百分比
NProgress.set(0.5)

const InfoService = axios.create({
  timeout: 3000, // 超时设置
  // withCredentials: true, // 如果发送请求的时候需要带上token 验证之类的也可以写在这个对象里
  headers: {
    token: gettingCK('token')
  }
})
// axios请求拦截器
InfoService.interceptors.request.use(
  (config) => {
    NProgress.start() // 设置加载进度条(开始..)
    // console.log('请求拦截器')
    return config
  },
  (error) => {
    NProgress.done() // 设置加载进度条(结束..)
    return Promise.reject(error)
  }
)
// axios响应拦截器
InfoService.interceptors.response.use(
  (res) => {
    NProgress.done() // 设置加载进度条(结束..)
    // console.log('响应拦截器')
    return res
  },
  (err) => {
    NProgress.done() // 设置加载进度条(结束..)
    return Promise.reject(err)
  }
)

export const EditGeneralAxios = (data) => {
  return InfoService.request({ data: { ...data }, ...editGeneralConfig })
}
export const EditPasswordAxios = (data) => {
  return InfoService.request({ data: { ...data }, ...editPasswordConfig })
}
