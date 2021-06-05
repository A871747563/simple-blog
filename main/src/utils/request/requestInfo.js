import axios from 'axios'
import { gettingCK } from 'utils/cookie-util'
import {
  homeConfig,
  AblogConfig,
  UblogConfig,
  DeleteblogConfig,
  ClassifyConfig,
  CloudConfig,
  NewblogConfig,
  EditblogConfig,
  blogTypesConfig,
  NewblogTypeConfig
} from 'api/interface/blogInfo.js' // 请求api
import { userinfoConfig } from 'api/interface/userInfo.js' // 请求api
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
NProgress.configure({ ease: 'ease', speed: 1000 }) // 调整动画设置
NProgress.configure({ minimum: 0.5 }) // 设置最低百分比
NProgress.set(0.5)

// InfoService.request({ header: { token: gettingCK('token') } })
// 各种请求对外暴露---------------------------------------------------------------------------
// --------------------------------博客主内容-----------------------------------------------

export let homeAxios
export let AblogAxios
export let UblogAxios
export let DeleteAxios
export let NewblogAxios
export let EditblogAxios
export let ClassifyAxios
export let CloudAxios
export let blogTypesAxios
export let NewblogTypeAxios
// ---------------------------------用户信息--------------------------------------------------
export let userinfoAxios
// --------------------------------轮询获取token(处理token初始化空值造成的请求错误)-------------------------------------------------------------
// token存在时直接初始化
if (gettingCK('token')) {
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

  homeAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...homeConfig })
  }
  AblogAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...AblogConfig })
  }
  UblogAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...UblogConfig })
  }
  DeleteAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...DeleteblogConfig })
  }
  NewblogAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...NewblogConfig })
  }
  EditblogAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...EditblogConfig })
  }
  ClassifyAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...ClassifyConfig })
  }
  CloudAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...CloudConfig })
  }
  blogTypesAxios = (params) => {
    return InfoService.request({ params: { ...params }, ...blogTypesConfig })
  }
  NewblogTypeAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...NewblogTypeConfig })
  }
  // ---------------------------------用户信息--------------------------------------------------
  userinfoAxios = (data) => {
    return InfoService.request({ data: { ...data }, ...userinfoConfig })
  }
  // 轮询获取token
} else {
  // 当token不存在时才进行轮询
  const tempToken = setInterval(() => {
    if (gettingCK('token')) {
      clearInterval(tempToken)
      // 创建一个axios应用
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

      homeAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...homeConfig })
      }
      AblogAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...AblogConfig })
      }
      UblogAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...UblogConfig })
      }
      DeleteAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...DeleteblogConfig })
      }
      NewblogAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...NewblogConfig })
      }
      EditblogAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...EditblogConfig })
      }
      ClassifyAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...ClassifyConfig })
      }
      CloudAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...CloudConfig })
      }
      blogTypesAxios = (params) => {
        return InfoService.request({ params: { ...params }, ...blogTypesConfig })
      }
      NewblogTypeAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...NewblogTypeConfig })
      }
      // ---------------------------------用户信息--------------------------------------------------
      userinfoAxios = (data) => {
        return InfoService.request({ data: { ...data }, ...userinfoConfig })
      }
    }
  }, 400)
}
