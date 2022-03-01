import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import {mixin} from './plugins/mixin'
import axios from 'axios'


axios.interceptors.response.use(
  response => {
    console.log(response)    
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      router.push('/')
      store.dispatch('logout')
      store.commit('setLoginModalOpen', true)
    }
     return Promise.reject(error)
  }
)

Vue.config.productionTip = false
Vue.mixin(mixin)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
