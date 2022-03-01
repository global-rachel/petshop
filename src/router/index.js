import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/admin',
    name: 'Admmin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: {requiresAuth: true},
    children:[
      {
        path: 'customers',
        name:'Customers',
        meta: {requiresAuth: true},
        component: ()=>import('../pages/Admin/Customer.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: ()=>import('../layouts/ShopLayout.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/admin/customers',
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{

  if (to.meta.requiresAuth) {
    if(store.state.token) next()
    else store.commit('setLoginModalOpen', true)
  } else {
    store.commit('setLoginModalOpen', false)
    next();
  }

})

export default router
