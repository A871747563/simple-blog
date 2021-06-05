import Layout from 'components/layout'
// 超管路由
export const superRoutes = {
  path: '/',
  name: 'Role',
  component: Layout,
  children: [
    {
      path: 'worktable',
      name: 'Worktable',
      meta: {
        name: '超管工作台',
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
        },
        {
          path: 'manageBlog',
          name: 'ManageBlog',
          meta: {
            name: '博客管理'
          },
          component: () => import('views/worktable/components/ManageBlog.vue')
        },
        {
          path: 'manageUser',
          name: 'ManageUser',
          meta: {
            name: '用户管理'
          },
          component: () => import('views/worktable/components/ManageUser.vue')
        }
      ]
    }
  ]
}
