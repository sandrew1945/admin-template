import Layout from '@/layout'

const usermanagerRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  name: '用户管理',
  // meta: {
  //   title: 'UserManager',
  //   icon: 'user'
  // },
  children: [
    {
      path: '/manager',
      name: 'userlist',
      component: () => import('@/views/user/index'),
      meta: { title: '用户管理', icon: 'user' }
    },
    {
      path: '/edit',
      name: 'useredit',
      component: () => import('@/views/user/edit'),
      meta: { title: '用户管理', icon: 'user' }
    }
  ]
}

export default usermanagerRouter
