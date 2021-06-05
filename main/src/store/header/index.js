import { gettingCK } from 'utils/cookie-util'
export default {
  namespaced: true,
  state: {
    userlogo: '', // 给只要头像的评论区
    theme: gettingCK('theme') || 'dark' // 给只要头像的评论区
  },
  getters: {
    getUserlogo: (state) => {
      return state.userlogo
    },
    getTheme: (state) => {
      return state.theme
    }
  },
  mutations: {
    setUserlogo(state, value) {
      state.userlogo = value
    },
    setTheme(state, value) {
      state.theme = value
    }
  },
  actions: {
    updateUserlogo(context, value) {
      context.commit('setUserlogo', value)
    },
    updateTheme(context, value) {
      context.commit('setTheme', value)
    }
  }
}
