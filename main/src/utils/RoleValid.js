// 根据身份返回对应的路由
import { defaultRoutes } from 'api/routeTable/defaultRoutes' // 默认路由表
import { generalRoutes } from 'api/routeTable/generalRoutes' // 超管路由表
import { superRoutes } from 'api/routeTable/superRoutes' // 一般路由表
import { errorRoutes } from 'api/routeTable/errorRoutes' // 错误路由表
// 获取总路由
export const getAllRouters = (role) => {
  // 直接等于复制可是地址,这会把默认路由也给修改了!!!!!!!!!过分
  const AllRoutes = deepClone2(defaultRoutes)
  // 把默认的权限路由表先给踢了
  AllRoutes.pop()
  if (role) {
    // 超管
    if (role === '1') {
      AllRoutes.push(superRoutes) // 权限路由
      AllRoutes.push(errorRoutes) // 404路由
      return AllRoutes
      // 一般
    } else if (role === '0') {
      AllRoutes.push(generalRoutes)
      AllRoutes.push(errorRoutes)
      return AllRoutes
    } else {
      return defaultRoutes
    }
  }
}
// 获取动态添加的路由
export const getAddRouters = (role) => {
  if (role) {
    if (role === '1') {
      return superRoutes
    } else if (role === '0') {
      return generalRoutes
      // 无身份
    } else {
      console.log('你到这就有很大问题了')
    }
  }
}

// 获取动态404路由
export const getErrorRouters = () => {
  return errorRoutes
}

// 深拷贝方法,爷哭了,可恶------------------------------------------------------------------------
function deepClone2(obj) {
  var _obj = JSON.stringify(obj)
  var objClone = JSON.parse(_obj)
  return objClone
}
