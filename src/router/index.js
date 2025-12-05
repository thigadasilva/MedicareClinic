import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Agenda from '@/views/Agenda.vue'
import Consultas from '@/views/Consultas.vue'
import Pacientes from '@/views/Pacientes.vue'
import Medicos from '@/views/Medicos.vue'

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
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    component: Pacientes,
    meta: {requiresAuth: true, requiresAdmin: true}
  },
  {
    path: '/medicos',
    name: 'Medicos',
    component: Medicos,
    meta: {requiresAuth: true, requiresAdmin: true}
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next)=>{
  const perfil = store.getters['auth/user']?.perfil
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const perfilRoutes = {
  admin: '/dashboard',
  medico: '/agenda',
  recepcionista: '/consultas'
}

  


  // 1. Rotas que exigem login
  if (to.meta.requiresAuth && !isAuthenticated) {
    if (to.path !== '/login') {
      return next('/login')
    }
  }

  // 2. Rotas que exigem admin
  if (to.meta.requiresAdmin && perfil !== 'admin') {
    if (!perfil) {
      store.dispatch('auth/logout')
      if (to.path !== '/login') {
        return next('/login')
      }
    }
    return next(perfilRoutes[perfil] || '/login')
  }

  // 3. Rotas guest (login)
  if (to.meta.requiresGuest && isAuthenticated) {
    const destino = perfilRoutes[perfil] || '/login'
    if (to.path !== destino) {
      return next(destino)
    }
  }

  // 4. Caso padrão
  next()
})

export default router