// // 404路由
export const errorRoutes = {
  path: '/:pathMatch(.*)*', // vue3新写法，使用正则
  name: '404redirect',
  redirect: '/404'
}
