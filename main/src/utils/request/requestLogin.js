import axios from 'axios'
import { loginConfig, registerConfig } from 'api/interface/login.js' // 请求api
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
NProgress.configure({ ease: 'ease', speed: 1000 }) // 调整动画设置
NProgress.configure({ minimum: 0.5 }) // 设置最低百分比
NProgress.set(0.5)

// 创建一个axios应用
const loginService = axios.create({
  timeout: 3000 // 超时设置
})
// axios请求拦截器
loginService.interceptors.request.use(
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
loginService.interceptors.response.use(
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

// 各种请求对外暴露---------------------------------------------------------------------------
export const loginAxios = (data) => {
  return loginService.request({ data: { ...data }, ...loginConfig })
}
export const registerAxios = (data) => {
  return loginService.request({ data: { ...data }, ...registerConfig })
}
