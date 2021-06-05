import router from './router'
import { gettingCK } from 'utils/cookie-util'
import { notify } from 'utils/element-util'
import { getAllRouters, getAddRouters, getErrorRouters } from 'utils/RoleValid'
import store from 'store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
NProgress.configure({ ease: 'ease', speed: 1000 }) // 调整动画设置
NProgress.configure({ minimum: 0.5 }) // 设置最低百分比

// 身份校验配置---------------------------------------------------------------------------------------------------
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    // 解决首页诡异进度条bug
    NProgress.start()
    NProgress.done()
    next()
  } else if (gettingCK('token') && gettingCK('is_superuser')) {
    const role = gettingCK('is_superuser')
    // 根据身份获取路由
    const allRouters = getAllRouters(role) // 拼接完layout后的总路由
    const addRouters = getAddRouters(role) // layout根据身份分配的路由
    const Router404 = getErrorRouters() // 404路由,这路由要放在表的最后,所以我们就只能把它单独抽离出来了
    // 动态添加路由(隐式路由)，决定了路由能否进行访问
    // 这个路由最容易出事
    router.hasRoute('Role') ? router.removeRoute('Role') : '' // 把初始的权限路由表给移走，更新出应该有的权限
    router.hasRoute('404redirect') ? router.removeRoute('404redirect') : ''
    router.addRoute(addRouters)
    router.addRoute(Router404)
    // 侧边栏layout路由存储----------------------------------------------------------------------------------------
    // 更新路由(显式路由，主要是为了解决侧边栏的显示)
    // router.options.routes 不是响应式的，我们必须改
    router.options.routes = allRouters
    const layoutRouter = allRouters.filter((item) => {
      return item.name === 'Layout' || item.name === 'Role'
    })
    // sider 的所有路由
    // 对象使用展开运算要小心,其会因为key冲突造成值覆盖问题!!!!
    // 将layout属下的路由整合起来
    const siderRouter = layoutRouter[0].children
    siderRouter.push(...layoutRouter[1].children)
    store.commit('SiderRoutes/setRoutes', siderRouter)
    next()
  } else {
    notify('请登录', 'warning')
    next('/login')
  }
})
// 使用路由守卫保证路由跳转一直在顶部---------------------------------------------------------------------------------------------------
router.afterEach((to, from) => {
  const bodySrcollTop = document.body.scrollTop
  if (bodySrcollTop !== 0) {
    document.body.scrollTop = 0
    return
  }
  const docSrcollTop = document.documentElement.scrollTop
  if (docSrcollTop !== 0) {
    document.documentElement.scrollTop = 0
  }
})
