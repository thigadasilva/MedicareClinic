import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import auth from './modules/auth'
import pacientes from './modules/pacientes'
import profissionais from './modules/profissionais'
import consulta from './modules/consulta'
import atendimento from './modules/atendimento'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['auth'] // só persiste o módulo auth
})

export default createStore({
    modules:{
        auth,
        pacientes,
        profissionais,
        consulta,
        atendimento
    },
    plugins: [vuexLocal.plugin]
})