import { createStore } from 'vuex'
import auth from './modules/auth'
import pacientes from './modules/pacientes'

export default createStore({
    modules:{
        auth,
        pacientes
    }
})