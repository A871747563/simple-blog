import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { defaultRoutes } from 'api/routeTable/defaultRoutes' // 路由表

const router = createRouter({
  history: createWebHashHistory(),
  routes: defaultRoutes
})
export default router
