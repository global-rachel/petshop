import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ()=>import('../layouts/ShopLayout.vue')
  },
  {
    path: '/Admin',
    name: 'Admmin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: {requiresAuth: true},
    children:[
      {
        path: 'customer',
        name:'Customer',
        component: ()=>import('../pages/Admin/Customer.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{

  if (to.meta.requiresAuth) {
    if(store.state.token) next()
    // TODO: specify setLogin Modal
    else store.commit('setModalOpen', true)
  } else {
    store.commit('setModalOpen', false)
    next();
  }

})

export default router
