import Login from 'views/login'
import Layout from 'components/layout'
import { gettingCK } from 'utils/cookie-util'
export const defaultRoutes = [
  {
    path: '/',
    redirect: gettingCK('token') ? '/home' : '/login'
  },
  {
    path: '/404',
    name: '404',
    component: () => import('views/404.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        meta: {
          name: '首页',
          icon: 'homepage_fill',
          keepAlive: true // 需要缓存
        },
        component: () => import('views/Home.vue')
      },
      {
        path: 'archives',
        name: 'Archives',
        meta: {
          name: '归档',
          icon: 'createtask_fill',
          keepAlive: true // 需要缓存
        },
        component: () => import('views/Archives.vue')
      },
      {
        path: 'classify',
        name: 'Classify',
        meta: {
          name: '分类',
          icon: 'tasklist_fill',
          keepAlive: true // 需要缓存
        },
        component: () => import('views/Classify.vue')
      },
      {
        path: 'tagcloud',
        name: 'Tagcloud',
        meta: {
          name: '标签',
          icon: 'label_fill',
          keepAlive: true // 需要缓存
        },
        component: () => import('views/Tagcloud.vue')
      },
      {
        path: 'blogDetail',
        name: 'BlogDetail',
        meta: {
          name: '博客细节',
          hidden: true,
          keepAlive: false // 需要缓存
        },
        component: () => import('views/BlogDetail.vue')
      },
      {
        path: 'editBlog',
        name: 'EditBlog',
        meta: {
          name: '编辑博客',
          hidden: true,
          keepAlive: true // 需要缓存
        },
        component: () => import('views/EditBlog.vue')
      },
      {
        path: 'demo',
        name: 'Demo',
        meta: {
          name: '测试',
          hidden: true,
          keepAlive: true // 需要缓存
        },
        component: () => import('views/demo.vue')
      },
      {
        path: '/userEdit',
        name: 'UserEdit',
        meta: {
          name: '用户信息修改',
          hidden: true,
          keepAlive: true // 需要缓存
        },
        component: () => import('views/UserEdit'),
        children: [
          {
            path: 'editInfo',
            name: 'EditInfo',
            meta: {
              name: '一般修改信息',
              hidden: true,
              keepAlive: true // 需要缓存
            },
            component: () => import('views/UserEdit/components/EditInfo.vue')
          },
          {
            path: 'editPassword',
            name: 'EditPassword',
            meta: {
              name: '修改密码',
              hidden: true,
              keepAlive: true // 需要缓存
            },
            component: () => import('views/UserEdit/components/EditPassword.vue')
          }
        ]
      }
    ]
  },
  // 本项目所有权限路由表(初始化配置，不然addroute方法使用会出现找不到路由的情况)
  {
    path: '/',
    name: 'Role',
    component: Layout,
    children: [
      {
        path: 'worktable',
        name: 'Worktable',
        meta: {
          name: '工作台',
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
]
