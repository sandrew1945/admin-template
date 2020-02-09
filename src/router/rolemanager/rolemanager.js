import Layout from '@/layout'

const rolemanagerRouter = {
  path: '/role',
  component: Layout,
  redirect: 'noRedirect',
  name: '角色管理',
  // meta: {
  //   title: '角色管理',
  //   icon: 'user'
  // },
  children: [
    {
      path: 'manager',
      name: 'rolelist',
      component: () => import('@/views/role/index'),
      meta: { title: '角色管理', icon: 'user', file: '@/views/role/index' }
    },
    {
      path: 'edit',
      name: 'roleedit',
      component: () => import('@/views/role/edit'),
      meta: { title: '维护角色' },
      hidden: true
    },
    {
      path: 'permission',
      name: 'managepermission',
      component: () => import('@/views/role/permission'),
      meta: { title: '角色权限维护' },
      hidden: true
    }
  ]
}

export default rolemanagerRouter
