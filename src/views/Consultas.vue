<template>
    <h1>Consultas</h1>

    

    <button @click="handleLogout">Logout</button>
</template>
<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    const handleLogout = () => {
      store.dispatch('auth/logout')
      router.push('/login') // redireciona para tela de login
    }

    return { handleLogout }
  }
}

</script>
<style scoped></style>