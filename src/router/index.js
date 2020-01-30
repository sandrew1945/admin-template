import Vue from 'vue'
import Router from 'vue-router'
import UserManager from './usermanager/usermanager'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/role',
    component: () => import('@/views/login/roletable'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard', file: '@/views/dashboard/index' }
    }]
  },
  UserManager,

  { path: '*', redirect: '/404', hidden: true }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export function rFormat(routers) {
  // 简单检查是否是可以处理的数据
  if (!(routers instanceof Array)) {
    return false
  }
  // 处理后的容器
  const fmRouters = []
  routers.forEach(router => {
    const path = router.path
    const component = router.component
    const name = router.name
    const hidden = router.hidden
    let children = router.children
    const meta = router.meta

    // 如果有子组件，递归处理
    if (children && children instanceof Array) {
      children = rFormat(children)
    }
    const fmRouter = {
      path: path,
      component(resolve) {
        // 拼出相对路径，由于component无法识别变量
        // 利用Webpack 的 Code-Splitting 功能
        if (router.component === 'Layout') {
          // Layout作为特殊组件处理，当然后端也可以写成'/layout/Layout.vue
          require(['@/layout'], resolve)
        } else {
          // '@/views'要拼接进去，组件直接返回'@/views/xxxx/xxx.vue'，然后require([compoent],resolve)会报错
          require(['@/views' + component], resolve)
        }
      },
      name: name,
      hidden: hidden,
      children: children,
      meta: meta
    }
    fmRouters.push(fmRouter)
  })
  return fmRouters
}

export default router
