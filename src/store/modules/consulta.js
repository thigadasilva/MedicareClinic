import api from '@/services/api'

const state = {
    consultas: [],
    consultaAtivo: null,
    loading: false,
    error: null
}

const mutations = {
    SET_LOADING(state, status){
        state.loading = status
    },
    SET_CONSULTAS(state, consultas){
        state.consultas = consultas
    },
    SET_CONSULTA_ATIVO(state, consulta){
        state.consultaAtivo = consulta
    },
    ADD_CONSULTA(state, consulta){
        state.consultas.push(consulta)
    },
    UPDATE_CONSULTA(state, consultaAtualizado){
        const index = state.consultas.findIndex((c) => c.id === consultaAtualizado.id)
        if(index != -1){
            state.consultas.splice(index, 1, consultaAtualizado)
        }
    },
    DELETE_CONSULTA(state, consultaId){
        state.consultas = state.consultas.filter((c) => c.id != consultaId) 
    },
    SET_ERROR(state, error){
        state.error = error
    }
}

const actions = {
     async fetchConsultas({commit}){
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.get('/consultas')
            commit('SET_CONSULTAS', response.data)
        } catch (error) {
            console.error('Erro ao buscar consultas: ', error)
            commit('SET_ERROR', error.response?.data?.message || 'Erro ao carregar consultas')
        } finally{
            commit('SET_LOADING', false)
        }
    },
     async createConsulta({commit}, consulta){
        try{
            const response = await api.post('/consultas',{
                protocolo: consulta.protocolo,
                pacienteId: consulta.pacienteId,
                medicoId: consulta.medicoId,
                data_consulta: consulta.data_consulta,
                hora_consulta: consulta.hora_consulta,
                tipo: consulta.tipo,
                status: consulta.status,
                motivo: consulta.motivo,
                observacoes: consulta.observacoes,
                data_confirmacao: consulta.data_confirmacao,
                data_cancelamento: consulta.data_cancelamento,
                motivo_cancelamento: consulta.motivo_cancelamento,
                agendadoPor: consulta.agendadoPor
            })
            commit('ADD_CONSULTA', response.data)
            return { success: true}
        } catch (error){
            console.error('Erro ao criar consulta: ', error)
            return{
                success: false,
                message: error.response?.data?.message || "Erro ao criar consulta"
            }
        } 
    },
    async updateConsulta({commit}, consulta){
        try {
            const response = await api.patch(`/consultas/${consulta.id}`, {
                protocolo: consulta.protocolo,
                pacienteId: consulta.pacienteId,
                medicoId: consulta.medicoId,
                data_consulta: consulta.data_consulta,
                hora_consulta: consulta.hora_consulta,
                tipo: consulta.tipo,
                status: consulta.status,
                motivo: consulta.motivo,
                observacoes: consulta.observacoes,
                data_confirmacao: consulta.data_confirmacao,
                data_cancelamento: consulta.data_cancelamento,
                motivo_cancelamento: consulta.motivo_cancelamento,
                agendadoPor: consulta.agendadoPor
            })
            commit('UPDATE_CONSULTA', response.data)
            return {success: true}
        } catch (error) {
            console.error('Erro ao atualizar consulta: ', error)
            return{
                success: false,
                message: error.response?.data?.message || 'Erro ao atualizar consulta!'
            }
        }
    },
    async deleteConsulta({commit}, consultaId){
        try {
            await api.delete(`/consultas/${consultaId}`)
            commit('DELETE_CONSULTA', consultaId)
            return { success: true}
        } catch (error) {
            console.error('Erro ao deletar consulta: ', error)
            return{
                success: false,
                message: error.response?.data?.message || 'Erro ao deletar profissional!'
            }
        }
    }
}

const getters = {
    consultas: (state) => state.consultas,
    totalConsultas: (state) => state.consultas.length,
    totalAgendadas: (state) => state.consultas.filter(c => c.status === 'agendada').length,
    totalRealizadas: (state) => state.consultas.filter(c => c.status === 'realizada').length,
    totalCanceladas: (state) => state.consultas.filter(c => c.status === 'cancelada').length,
    totalFaltas: (state) => state.consultas.filter(c => c.status === 'faltou').length,
    loading: (state) => state.loading,
    error: (state) => state.error
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}