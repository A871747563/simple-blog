import { createStore } from 'vuex'
import login from './login/index'
import SiderRoutes from './SiderRoutes/index'
import header from './header/index'

export default createStore({
  state: {},
  getter: {},
  mutations: {},
  actions: {},
  modules: { login, SiderRoutes, header }
})
