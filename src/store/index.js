import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isModalOpen: false,
  },
  mutations: {
    setModalOpen: (state, payload)=>{
      state.isModalOpen = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
