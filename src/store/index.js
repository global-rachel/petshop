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
    isLoginModalOpen: false,
    isSideMenuOpen: false,
    editedUser: []
  },
  mutations: {
    setToken: (state, payload)=>{
      state.token = payload
    },
    setLoginModalOpen: (state, payload)=>{
      state.isLoginModalOpen = payload
    },
    toggleSideMenu: (state)=>{
      state.isSideMenuOpen = !state.isSideMenuOpen

    },
    saveEditedUser: (state, payload)=>{
      const isExisiting = state.editedUser.map(item=>item.uuid).includes(payload.uuid)

      if(isExisiting)state.editedUser = state.editedUser.map(user=>{
        if(user.uuid === payload.uuid){
          return payload
        }
        else return user
      })
      else state.editedUser.push(payload)
    }
  },
  getters:{
    isLogin(state){
      return state.token && state.token !== null;
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
          // Clear all vuex states
          sessionStorage.clear();
          window.location.reload()
          resolve();
        }).catch(error=>{
          console.log(error)
          reject(error.response.data.error)
        })
      })
    },
    getAllUsersAPI: async (context,payload)=>{      
      try {
        const res = await axios.get(`${API_HOST}${PAGE_ADMIN}/user-listing`,{
          headers:{
            Authorization: `${context.state.token}`
          },
          params: payload
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
          reject(error)
        })
      })

    },
    editUserAPI:(context,payload)=>{
      context.commit('saveEditedUser', payload);
      return Promise.resolve();

    },
    deleteUserAPI: async (context,uuid)=>{

      try {
        const res = await axios.delete(`${API_HOST}${PAGE_ADMIN}/user-delete/${uuid}`,{
          headers:{
            Authorization: `${context.state.token}`
          }
        })
        return res
        
      } catch(error){
        console.log(error)
      }
      
      

    }

  },
  modules: {
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })]
})

