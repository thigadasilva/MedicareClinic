import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import auth from './modules/auth'
import pacientes from './modules/pacientes'
import profissionais from './modules/profissionais'
import consultas from './modules/consulta'
import atendimentos from './modules/atendimento'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['auth'] // só persiste o módulo auth
})

export default createStore({
    modules:{
        auth,
        pacientes,
        profissionais,
        consultas,
        atendimentos
    },
    plugins: [vuexLocal.plugin]
})