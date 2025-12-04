import api from '@/services/api'

const state = {
    atendimentos: [],
    atendimentoAtivo: null,
    loading: false,
    error: null
}

const mutations = {
    SET_LOADING(state, status){
        state.loading = status
    },
    SET_ATENDIMENTOS(state, atendimentos){
        state.atendimentos = atendimentos
    },
    SET_ATENDIMENTO_ATIVO(state, atendimento){
        state.atendimentoAtivo = atendimento
    },
    ADD_ATENDIMENTO(state, atendimento){
        state.atendimentos.push(atendimento)
    },
    UPDATE_ATENDIMENTO(state, atendimentoAtualizado){
        const index = state.atendimentos.findIndex((p) => p.id === atendimentoAtualizado.id)
        if(index != -1){
            state.atendimentos.splice(index, 1, atendimentoAtualizado)
        }
    },
    DELETE_ATENDIMENTO(state, atendimentoId){
        state.atendimentos = state.atendimentos.filter((p) => p.id != atendimentoId) 
    },
    SET_ERROR(state, error){
        state.error = error
    }
}

const actions = {
    async fetchAtendimento({commit}){
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.get('/atendimentos')
            commit('SET_ATENDIMENTOS', response.data)
        } catch (error) {
            console.error('Erro ao buscar atendimentos: ', error)
            commit('SET_ERROR', error.response?.data?.message || 'Erro ao carregar atendimentos')
        } finally{
            commit('SET_LOADING', false)
        }
    },
     async createAtendimento({commit}, atendimento){
        try{
            const response = await api.post('/atendimentos',{
                consultaId: atendimento.consultaId,
                anamnese: atendimento.anamnese,
                diagnostico: atendimento.diagnostico,
                prescricao: atendimento.prescricao,
                observacoes: atendimento.observacoes,
                exames_solicitados: atendimento.exames_solicitados,
                retorno_dias: atendimento.retorno_dias,
                medicoId: atendimento.medicoId,
                data_atendimento: atendimento.data_atendimento,
            })
            commit('ADD_ATENDIMENTO', response.data)
            return { success: true}
        } catch (error){
            console.error('Erro ao criar atendimento: ', error)
            return{
                success: false,
                message: error.response?.data?.message || "Erro ao criar atendimento"
            }
        } 
    },
     async updateAtendimento({commit}, atendimento){
        try {
            const response = await api.patch(`/atendimentos/${atendimento.id}`, {
               consultaId: atendimento.consultaId,
                anamnese: atendimento.anamnese,
                diagnostico: atendimento.diagnostico,
                prescricao: atendimento.prescricao,
                observacoes: atendimento.observacoes,
                exames_solicitados: atendimento.exames_solicitados,
                retorno_dias: atendimento.retorno_dias,
                medicoId: atendimento.medicoId,
                data_atendimento: atendimento.data_atendimento
            })
            commit('UPDATE_ATENDIMENTO', response.data)
            return {success: true}
        } catch (error) {
            console.error('Erro ao atualizar atendimento: ', error)
            return{
                success: false,
                message: error.response?.data?.message || 'Erro ao atualizar atendimento!'
            }
        }
    },
     async deleteAtendimento({commit}, atendimentoId){
        try {
            await api.delete(`/atendimentos/${atendimentoId}`)
            commit('DELETE_ATENDIMENTO', atendimentoId)
            return { success: true}
        } catch (error) {
            console.error('Erro ao deletar atendimento: ', error)
            return{
                success: false,
                message: error.response?.data?.message || 'Erro ao deletar atendimento!'
            }
        }
    }
}

const getters = {
    atendimentos: (state) => state.atendimentos,
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