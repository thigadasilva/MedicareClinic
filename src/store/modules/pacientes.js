import api from '@/services/api'

const state = {
  pacientes: [],
  pacienteAtivo: null,
  loading: false,
  error: null
}

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_PACIENTES(state, pacientes) {
    state.pacientes = pacientes
  },
  SET_PACIENTE_ATIVO(state, paciente){
    state.pacienteAtivo = paciente
  },
  ADD_PACIENTE(state, paciente) {
    state.pacientes.push(paciente)
  },
  UPDATE_PACIENTE(state, pacienteAtualizado) {
    const index = state.pacientes.findIndex((p) => p.id === pacienteAtualizado.id)
    if (index != -1) {
      state.pacientes.splice(index, 1, pacienteAtualizado)
    }
  },
  DELETE_PACIENTE(state, pacienteId) {
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
  async fetchPacienteDetalhes({commit}, pacienteId){
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try{
      const response = await api.get(`/pacientes/${pacienteId}`)

      commit('SET_PACIENTE_ATIVO', response.data)

      return { success: true}
    } catch(error){
      console.error('Erro ao buscar detalhes do paciente: ', error)
      commit('SET_ERROR', 'Erro ao carregar detalhes do paciente!')
      return {success: false}
    } finally{
      commit('SET_LOADING', false)
    }
  },

  async createPaciente({ commit }, paciente) {
    try {
      const response = await api.post('/pacientes', {
        nome: paciente.nome,
        cpf: paciente.cpf,
        data_nascimento: paciente.data_nascimento,
        telefone: paciente.telefone,
        email: paciente.email,
        endereco: paciente.endereco,
        cidade: paciente.cidade,
        estado: paciente.estado,
        cep: paciente.cep,
        convenio: paciente.convenio,
        numero_convenio: paciente.numero_convenio,
        ativo: paciente.ativo
      })
      commit('ADD_PACIENTE', response.data)
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
        telefone: paciente.telefone,
        email: paciente.email,
        endereco: paciente.endereco,
        cidade: paciente.cidade,
        estado: paciente.estado,
        cep: paciente.cep,
        convenio: paciente.convenio,
        numero_convenio: paciente.numero_convenio,
        ativo: paciente.ativo
      })
      commit('UPDATE_PACIENTE', response.data)
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
      commit('DELETE_PACIENTE', pacienteId)
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