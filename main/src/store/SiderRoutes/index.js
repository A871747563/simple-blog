// 存储侧边栏layout属下的路由
export default {
  namespaced: true,
  state: {
    routes: {}
  },
  getters: {
    getRoutes: state => {
      return state.routes
    }
  },
  mutations: {
    setRoutes(state, routes) {
      state.routes = routes
    }
  },
  actions: {
    updateRoutes(context, routes) {
      context.commit('setRoutes', routes)
    }

  }
}
