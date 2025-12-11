import api from '@/services/api'

const state = {
    profissionais: [],
    profissionalAtivo: null,
    loading: false,
    error: null
}

const mutations = {
    SET_LOADING(state, status){
        state.loading = status
    },
    SET_PROFISSIONAIS(state, profissionais){
        state.profissionais = profissionais
    },
    SET_PROFISSIONAL_ATIVO(state, profissional){
        state.profissionalAtivo = profissional
    },
    ADD_PROFISSIONAL(state, profissional){
        state.profissionais.push(profissional)
    },
    UPDATE_PROFISSIONAL(state, profissionalAtualizado){
        const index = state.profissionais.findIndex((p) => p.id === profissionalAtualizado.id)
        if(index != -1){
            state.profissionais.splice(index, 1, profissionalAtualizado)
        }
    },
    DELETE_PROFISSIONAL(state, profissionalId){
        state.profissionais = state.profissionais.filter((p) => p.id != profissionalId) 
    },
    SET_ERROR(state, error){
        state.error = error
    }
}

const actions = {
    async fetchProfissionais({commit}){
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.get('/api/profissionais')
            commit('SET_PROFISSIONAIS', response.data)
        } catch (error) {
            console.error('Erro ao buscar profissionais: ', error)
            commit('SET_ERROR', error.response?.data?.message || 'Erro ao carregar profissionais')
        } finally{
            commit('SET_LOADING', false)
        }
    },
    async createProfissional({commit}, profissional){
        try{
            const response = await api.post('/api/profissionais',{
                nome: profissional.nome,
                email: profissional.email,
                crm: profissional.crm,
                especialidade: profissional.especialidade,
                perfil: profissional.perfil,
                status: profissional.status
            })
            commit('ADD_PROFISSIONAL', response.data)
            return { success: true}
        } catch (error){
            console.error('Erro ao criar profissional: ', error)
            return{
                success: false,
                message: error.response?.data?.message || "Erro ao criar profissional"
            }
        } 
    },
    async updateProfissional({commit}, profissional){
        try {
            const response = await api.patch(`/api/profissionais/${profissional.id}`, {
                nome: profissional.nome,
                email: profissional.email,
                crm: profissional.crm,
                especialidade: profissional.especialidade,
                perfil: profissional.perfil,
                status: profissional.status
            })
            commit('UPDATE_PROFISSIONAL', response.data)
            return {success: true}
        } catch (error) {
            console.error('Erro ao atualizar profissional: ', error)
            return{
                success: false,
                message: error.response?.data?.message || 'Erro ao atualizar profissional!'
            }
        }
    },
    async deleteProfissional({commit}, profissionalId){
        try {
            await api.delete(`/api/profissionais/${profissionalId}`)
            commit('DELETE_PROFISSIONAL', profissionalId)
            return { success: true}
        } catch (error) {
            console.error('Erro ao deletar profissional: ', error)
            return{
                success: false,
                message: error.response?.data?.message || 'Erro ao deletar profissional!'
            }
        }
    }
}

const getters = {
    profissionais: (state) => state.profissionais,
    totalProfissionais: state => state.profissionais.length,
    totalMedicos: state => state.profissionais.filter(p => p.perfil === 'medico').length,
    totalAtivos: state => state.profissionais.filter(p => p.ativo).length,
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