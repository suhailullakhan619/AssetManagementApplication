import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
export default createStore({
  plugins:[createPersistedState()],
  state: {
    currentUser:null
  },
  getters: {
    currentUser:(state)=>state.currentUser,
  },
  mutations: {
  SET_CURRENT_USER(state,user){
    state.currentUser=user
  },
  CLEAR_CURRENT_USER(state){
    state.currentUser=null
  }
  },
  actions: {
    setCurrentUser({commit},user){
      commit('SET_CURRENT_USER',user)
    },
    clearCurrentUser({commit}){
commit('CLEAR_CURRENT_USER')
    },
  },
  modules: {
  }
})
