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
  },
  (error) => {
    if (error.response.status === 401) {
      router.push('/')
      store.commit('setModalOpen', true)
    }
    return 
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
