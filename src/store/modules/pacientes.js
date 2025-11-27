import api from '@/services/api'

const state = {
  pacientes: [],
  loading: false,
  error: null,
}

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_pacientes(state, pacientes) {
    state.pacientes = pacientes
  },
  ADD_paciente(state, paciente) {
    state.pacientes.push(paciente)
  },
  UPDATE_paciente(state, pacienteAtualizado) {
    const index = state.pacientes.findIndex((p) => p.id === pacienteAtualizado.id)
    if (index != -1) {
      state.pacientes.splice(index, 1, pacienteAtualizado)
    }
  },
  DELETE_paciente(state, pacienteId) {
   state.pacientes = state.pacientes.filter((p) => p.id != pacienteId)
  },
  SET_ERROR(state, error) {
    state.error = error
  },
}

const actions = {
  async fetchPacientes({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await api.get('/pacientes')
      commit('SET_pacientes', response.data)
    } catch (error) {
      console.error('Error ao buscar pacientes:', error)
      commit('SET_ERROR', error.response?.data?.message || 'Error ao carregar pacientes')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createPaciente({ commit }, paciente) {
    try {
      const response = await api.post('/pacientes', {
        nome: paciente.nome,
        preco: parseFloat(paciente.preco),
      })
      commit('ADD_paciente', response.data)
      return { success: true }
    } catch (error) {
      console.error('Erro ao criar paciente:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error ao criar paciente',
      }
    }
  },
  async updatePaciente({ commit }, paciente) {
    try {
      const response = await api.put(`/pacientes/${paciente.id}`, {
        nome: paciente.nome,
        preco: parseFloat(paciente.preco),
      })
      commit('UPDATE_paciente', response.data)
      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar paciente!',
      }
    }
  },
  async deletePaciente({ commit }, pacienteId) {
    try {
      await api.delete(`/pacientes/${pacienteId}`)
      commit('DELETE_paciente', pacienteId)
      return { success: true }
    } catch (error) {
      console.error('Erro ao deletar paciente:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao deletar paciente!',
      }
    }
  },
}

const getters = {
  pacientes: (state) => state.pacientes,
  loading: (state) => state.loading,
  error: (state) => state.error,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}