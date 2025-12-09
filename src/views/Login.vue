<template>
  <div class="login-wrapper">

    <div class="left-panel">
      <div class="left-content">
        <img src="@/assets/LogoMediCare.png" class="logo-image" alt="logo" />

        <div class="title-group">
          <h1>MediCare</h1>
          <h2>Clinic</h2>
        </div>
      </div>


      <div class="left-bottom-content">
        
        <img src="@/assets/login-image.png" class="left-image" alt="med" />
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
  font-family: "Montserrat", sans-serif;
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
  flex-direction: column;     
  justify-content: space-between;
  padding-left: 2rem;
  padding-top: 2rem;
  min-height: 0;             
}


.left-content {
  display: flex;
  align-items: center;
  gap: 0.8rem; 
  animation-delay: 0.2s;
}

.title-group {
  display: flex;
  flex-direction: column;
  line-height: 1;
  margin: 0;
  padding: 0;
}

.left-content h1 {
  font-size: 2.6rem;
  margin: 0;
  animation-delay: 0.4s;
}

.left-content h2 {
  font-size: 1.8rem;
  margin: 0;
  margin-top: -5px;
  font-weight: 400;
  animation-delay: 0.6s;
}

.left-content > * {
  opacity: 0;
  animation: fadeIn 0.9s ease forwards;
}

.left-panel p {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 2rem;
}

.logo-image{
  width: 60px;        
  height: auto;
  object-fit: contain;
  animation-delay: 0.2s;
}

.left-image {
  width: 70%;            
  max-width: 1000px;     
  min-width: 180px;     
  height: 100%;
  padding-left: 15%;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0px 8px 20px rgba(0, 0, 0, 0.25));
}


.right-panel {
  flex: 1;
  background: #f1f1f1;
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
  animation: fadeIn 0.9s ease forwards;
  opacity: 0;
}

.login-form {
  width: 100%;
}

@keyframes fadeIn {
  from{
    opacity: 0;
    transform: translateY(20px);
  } to {
    opacity: 1;
    transform: translateY(0);
  }
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
