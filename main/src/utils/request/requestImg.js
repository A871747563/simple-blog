// 设计给图片上传的请求
import axios from 'axios'
import { uploadConfig } from 'api/interface/uploadImg.js' // 请求api
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
NProgress.configure({ ease: 'ease', speed: 1000 }) // 调整动画设置
NProgress.configure({ minimum: 0.5 }) // 设置最低百分比
NProgress.set(0.5)
// 创建 axios 实例
const ImgService = axios.create({
  baseURL: '',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 将请求数据转换成功 formdata 接收格式
ImgService.defaults.transformRequest = (data) => {
  return stringify(data)
}
// axios请求拦截器---------------------------------------------------------
ImgService.interceptors.request.use(
  (config) => {
    NProgress.start() // 设置加载进度条(开始..)
    return config
  },
  (error) => {
    NProgress.done() // 设置加载进度条(结束..)
    return Promise.reject(error)
  }
)
// axios响应拦截器---------------------------------------------------------
ImgService.interceptors.response.use(
  (res) => {
    NProgress.done() // 设置加载进度条(结束..)
    return res
  },
  (err) => {
    NProgress.done() // 设置加载进度条(结束..)
    return Promise.reject(err)
  }
)
// 将参数转换成功 formdata 接收格式
function stringify(data) {
  const formData = new FormData()
  for (const key in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(key)) {
      if (data[key]) {
        if (data[key].constructor === Array) {
          if (data[key][0]) {
            if (data[key][0].constructor === Object) {
              formData.append(key, JSON.stringify(data[key]))
            } else {
              data[key].forEach((item, index) => {
                formData.append(key + `[${index}]`, item)
              })
            }
          } else {
            formData.append(key + '[]', '')
          }
        } else if (data[key].constructor === Object) {
          formData.append(key, JSON.stringify(data[key]))
        } else {
          formData.append(key, data[key])
        }
      } else {
        if (data[key] === 0) {
          formData.append(key, 0)
        } else {
          formData.append(key, '')
        }
      }
    }
  }
  return formData
}

// 各种请求对外暴露---------------------------------------------------------------------------
// ------------------------------图片上传-----------------------------------------------------
export const uploadAxios = (data) => {
  return ImgService.request({ data: { ...data }, ...uploadConfig })
}
