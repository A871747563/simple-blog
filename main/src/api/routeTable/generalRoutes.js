import Layout from 'components/layout'
//  普通路由
export const generalRoutes = {
  path: '/',
  name: 'Role',
  component: Layout,
  children: [
    {
      path: 'worktable',
      name: 'Worktable',
      meta: {
        name: '我的工作台',
        icon: 'manage_fill',
        keepAlive: false // 需要缓存
      },
      component: () => import('views/worktable'),
      children: [
        {
          path: 'myBlog',
          name: 'MyBlog',
          meta: {
            name: '我的博客'
          },
          component: () => import('views/worktable/components/MyBlog.vue')
        },
        {
          path: 'newBlog',
          name: 'NewBlog',
          meta: {
            name: '新建博客'
          },
          component: () => import('views/worktable/components/NewBlog.vue')
        }
      ]
    }
  ]
}
