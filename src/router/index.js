import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {requiresAuth: true}
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next)=>{
  const isAuthenticated = store.getters['auth/isAuthenticated']

  if(to.meta.requiresAuth && !isAuthenticated){
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated){
    next('/home')
  }else{
    next()
  }
})

export default router