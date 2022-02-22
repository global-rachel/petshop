import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const API_HOST = 'https://pet-shop.buckhill.com.hr/api/v1/'
const PAGE_ADMIN = 'admin'

export default new Vuex.Store({
  state: {
    token: null,
    isModalOpen: false,
  },
  mutations: {
    setToken: (state, payload)=>{
      state.token = payload
    },
    setModalOpen: (state, payload)=>{
      state.isModalOpen = payload
    }
  },
  actions: {
    login: (context, {email, password})=>{
      return new Promise((resolve, reject)=>{
        axios.post(`${API_HOST}${PAGE_ADMIN}/login`,{
          email,
          password
        }).then(res=>{
          context.commit('setToken', res.data.data.token);
          resolve(res.data);
         }
        ).catch(error=>{
          console.log(error)
          reject(error.response.data.error)
        }
        )
      })
    }
  },
  modules: {
  }
})
