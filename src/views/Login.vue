<template>
  <div class="login-wrapper">

    <div class="left-panel">
      <div class="left-content">
        <h1>MediCare Clinic</h1>

        <img src="@/assets/login-image.png" class="left-image" />
     
      </div>
    </div>

    <div class="right-panel">
      <div class="login-box">
        <div class="login-form">

          <h2>Login</h2>

          <form @submit.prevent="handleLogin">

            <div class="form-group">
              <label>E-mail:</label>
              <input type="text" v-model="credentials.email" required />
            </div>

            <div class="form-group">
              <label>Senha:</label>
              <input type="password" v-model="credentials.senha" required />
            </div>

            <button type="submit" :disabled="loading">
              {{ loading ? 'Entrando ...' : 'Entrar' }}
            </button>

            <div v-if="error" class="error">{{ error }}</div>

          </form>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()

    const credentials = ref({
      email: '',
      senha: ''
    });

    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      const payload = {
        email: credentials.value.email,
        senha: credentials.value.senha,
      }

      loading.value = true
      error.value = ''

      const result = await store.dispatch('auth/login', payload)

      if (result.success) {
        const perfil = store.getters['auth/user']?.perfil
        const perfilRoutes = {
          admin: '/dashboard',
          medico: '/agenda',
          recepcionista: '/consultas'
        }
        const destino = perfilRoutes[perfil]

        if (destino) {
          router.push(destino)
        } else {
          console.error('Perfil não reconhecido:', perfil)
          store.dispatch('auth/logout')
          error.value = 'Seu perfil não tem acesso ao sistema.'
        }
      } else {
        error.value = result.message || 'Erro ao fazer login. Verifique suas credenciais.'
      }

      loading.value = false
    }

    return {
      credentials,
      loading,
      error,
      handleLogin,
    }
  },
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>

<style scoped>

:global(html, body, #app) {
  font-family: "Poppins", sans-serif;
}

.login-wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #1D9290, #00c2c7);
  color: white;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 3rem;
  padding-top: 3rem;
}

.left-content {
  max-width: 350px;
}

.left-panel h1 {
  font-size: 2.6rem;
  margin-bottom: 1rem;
}

.left-panel p {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 2rem;
}

.left-image {
  width: 2000px;
  max-width: 50rem;
  margin-top: -180px;
  margin-left: 150px;


}

.right-panel {
  flex: 1;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: #BAD3D5;
  color: #0A2426;
  border-radius: 40px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  min-height: 450px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  width: 100%;
}

.login-form h2 {
  text-align: center;
  font-size: 1.7rem;
  margin-bottom: 6rem;
}

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
}

input {
  background: #BAD3D5;
  width: 378px;
  padding: 0.6rem;
  border: 2px solid #1D5358;
  border-radius: 15px;
}

button {
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  background-color: #1D5358;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.2s;
}

button:hover:not(:disabled) {
  background-color: #0A2426;
}

button:disabled {
  background-color: #8ccbd1;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
