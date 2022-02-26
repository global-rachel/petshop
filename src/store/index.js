import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const API_HOST = 'https://pet-shop.buckhill.com.hr/api/v1/'
const PAGE_ADMIN = 'admin'
const PAGE_USER = 'user'

export default new Vuex.Store({
  state: {
    token:  null,
    isModalOpen: false,
    isSideMenuOpen: false,
  },
  mutations: {
    setToken: (state, payload)=>{
      state.token = payload
    },
    setModalOpen: (state, payload)=>{
      state.isModalOpen = payload
    },
    toggleSideMenu: (state)=>{
      state.isSideMenuOpen = !state.isSideMenuOpen

    }
  },
  getters:{
  },
  actions: {    
    login: (context, {email, password})=>{
      return new Promise((resolve, reject)=>{
        axios.post(`${API_HOST}${PAGE_ADMIN}/login`,{
          email,
          password
        }).then(res=>{
          context.commit('setToken', res.data.data.token);
          resolve(res);
         }
        ).catch(error=>{
          console.log(error)
          reject(error)
        }
        )
      })
    },
    logout:(context)=>{
      return new Promise((resolve,reject)=>{
        axios.get(`${API_HOST}${PAGE_ADMIN}/logout`).then(()=>{
          context.commit('setToken', null);
          window.location.reload()
          resolve();
        }).catch(error=>{
          console.log(error)
          reject(error.response.data.error)
        })
      })
    },
    getAllUsersAPI: async (context)=>{   
      try {
        const res = await axios.get(`${API_HOST}${PAGE_ADMIN}/user-listing`,{
          headers:{
            Authorization: `${context.state.token}`
          }
        })
        return res
        
      } catch(error){
        console.log(error)
      }
      
    },
    createUserAPI:(context,payload)=>{
      return new Promise((resolve,reject)=>{
        axios.post(`${API_HOST}${PAGE_USER}/create`,payload).then(()=>{
          resolve();
        }).catch(error=>{
          console.log(error)
          reject(error.response.data.error)
        })
      })

    },
    editUserAPI:()=>{
      return true
      // return new Promise((resolve,reject)=>{
      //   axios.put(`${API_HOST}${PAGE_USER}/edit`,payload).then(()=>{
      //     resolve();
      //   }).catch(error=>{
      //     console.log(error)
      //     reject(error.response.data.error)
      //   })
      // })

    },
    deleteUserAPI:(context,uuid)=>{
      return new Promise((resolve,reject)=>{
        axios.delete(`${API_HOST}${PAGE_ADMIN}/user-delete/${uuid}`,{
          headers:{
            Authorization: `${context.state.token}`
          }
        }).then(()=>{
          resolve();
        }).catch(error=>{
          console.log(error)
          reject(error.response.data.error)
        })
      })

    }

  },
  modules: {
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })]
})

