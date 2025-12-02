import api from '@/services/api'

const state = {
  token: localStorage.getItem('token') || null,
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    state.isAuthenticated = !!token
    localStorage.setItem('token', token)
  },
  CLEAR_TOKEN(state) {
    state.token = null
    state.isAuthenticated = false
    localStorage.removeItem('token')
  },
  SET_USER(state, user) {
    state.user = user
     if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
  },
}

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await api.post('/api/auth/login', {
        email: credentials.email,
        senha: credentials.senha,
      })

 console.log('Resposta completa do backend:', response);
      console.log('Dados da resposta (response.data):', response.data);

      const token = response.data.token
      const user = response.data.user

      commit('SET_TOKEN', token)
      commit('SET_USER', user)

      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error ao fazer login',
      }
    }
  },
  logout({ commit }) {
    commit('CLEAR_TOKEN')
    commit('SET_USER', null)
  },
}

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
  token: (state) => state.token,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}