import Layout from '@/layout'

const usermanagerRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  name: '用户管理',
  // meta: {
  //   title: '用户管理',
  //   icon: 'user'
  // },
  children: [
    {
      path: 'manager',
      name: 'userlist',
      component: () => import('@/views/user/index'),
      meta: { title: '用户管理', icon: 'user', file: '@/views/user/index' }
    },
    {
      path: 'edit',
      name: 'useredit',
      component: () => import('@/views/user/edit'),
      meta: { title: '维护用户' },
      hidden: true
    },
    {
      path: 'roles',
      name: 'manageroles',
      component: () => import('@/views/user/manageroles'),
      meta: { title: '用户角色维护' },
      hidden: true
    }
  ]
}

export default usermanagerRouter
