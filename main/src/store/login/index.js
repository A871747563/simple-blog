export default {
  namespaced: true,
  state: {
    islogin: true, // 登录和注册切换
    username: '', // 登录默认用户名和密码
    password: ''
  },
  getters: {
    getIslogin: (state) => {
      return state.islogin
    },
    getUsername: (state) => {
      return state.username
    },
    getPassword: (state) => {
      return state.password
    }
  },
  mutations: {
    setIslogin(state, value) {
      state.islogin = value
    },
    setUsername(state, value) {
      state.username = value
    },
    setPassword(state, value) {
      state.password = value
    }
  },
  actions: {
    updateIslogin(context, value) {
      context.commit('setIslogin', value)
    },
    updateUsername(context, value) {
      context.commit('setUsername', value)
    },
    updatePassword(context, value) {
      context.commit('setPassword', value)
    }
  }
}
