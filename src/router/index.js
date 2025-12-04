import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Agenda from '@/views/Agenda.vue'
import Consultas from '@/views/Consultas.vue'

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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {requiresAuth: true}
  },
  {
    path: '/agenda',
    name: 'Agenda',
    component: Agenda,
    meta: {requiresAuth: true}
  },
  {
    path: '/consultas',
    name: 'Consultas',
    component: Consultas,
    meta: {requiresAuth: true}
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next)=>{
  const perfil = store.getters['auth/user']?.perfil
  const perfilRoutes = {
  admin: '/dashboard',
  medico: '/agenda',
  recepcionista: '/consultas'
}

  const isAuthenticated = store.getters['auth/isAuthenticated']

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAuth && to.meta.perfil && perfil !== to.meta.perfil) {
    next(perfilRoutes[perfil] || '/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    if (perfilRoutes[perfil]) {
      next(perfilRoutes[perfil])
    } else {
      store.dispatch('auth/logout')
      next('/login')
    }
  } else {
    next()
  }})

export default router