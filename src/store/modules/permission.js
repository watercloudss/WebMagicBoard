import { asyncRoutes, constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.component === 'Layout') {
      tmp.component = Layout
    } else if (tmp.component === 'ParentView') {
      tmp.component = ParentView
    } else {
      console.log('渲染children：')
      tmp.component = loadView(tmp.component)
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        console.log('children：', tmp.children)
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    console.log('roles:', roles)
    return new Promise(resolve => {
      getRouters().then(res => {
        const sdata = JSON.parse(JSON.stringify(res.data))
        // const sd = filterAsyncRouter(sdata)
        let accessedRoutes
        // accessedRoutes = filterAsyncRouter(sdata, roles)
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          console.log('开始处理路由信息')
          accessedRoutes = filterAsyncRoutes(sdata, roles)
          console.log('accessedRoutes', accessedRoutes)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        console.log(error)
      })
    })
  }
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return (resolve) => require([`@/views/${view}`], resolve)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
