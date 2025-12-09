<template>
  <div class="container">
    <BarraLateral
      :username="store.state.auth.user?.nome"
      :userRole="store.state.auth.user?.perfil"
      @navigate="handleNavigate"
      @logout="handleLogout"
    />

    <main>
      <div class="header">
        <h2 class="title">Pacientes</h2>

        <button class="novo" @click="abrirModal">
          <img src="../assets/plus.png" />Novo Paciente
        </button>
      </div>

      <p class="subtitle">Visão geral dos pacientes</p>

      <div class="search-box">
        <input type="text" placeholder="Buscar paciente..." />
      </div>

      <div class="cards">
        <Card
          v-for="paciente in pacientes"
          :key="paciente.id"
          :title="paciente.nome"
          :subtitle="paciente.cpf"
          :description="paciente.email"
        />
      </div>
    </main>

    <!-- ✅ MODAL DE CADASTRO -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal">

        <h3>Novo Paciente</h3>

        <form @submit.prevent="cadastrarPaciente">

  <label>Nome Completo *</label>
  <input v-model="novoPaciente.nome" placeholder="Nome do paciente" required />

  <label>CPF *</label>
  <input v-model="novoPaciente.cpf" placeholder="000.000.000-00" required />

  <label>E-mail</label>
  <input v-model="novoPaciente.email" placeholder="email@exemplo.com" />

  <label>Telefone</label>
  <input v-model="novoPaciente.telefone" placeholder="(00) 00000-0000" />

  <label>Data de Nascimento *</label>
  <input type="date" v-model="novoPaciente.data_nascimento" required />

  <!-- NOVOS CAMPOS -->
  <label>Endereço</label>
  <input v-model="novoPaciente.endereco" placeholder="Rua, número" />

  <label>Cidade</label>
  <input v-model="novoPaciente.cidade" placeholder="Cidade" />

  <label>Estado</label>
  <input v-model="novoPaciente.estado" placeholder="Estado" />

  <label>CEP</label>
  <input v-model="novoPaciente.cep" placeholder="00000-000" />

  <label>Convênio</label>
  <input v-model="novoPaciente.convenio" placeholder="Nome do convênio" />

  <label>Número do Convênio</label>
  <input v-model="novoPaciente.numero_convenio" placeholder="Número da carteirinha" />

  <div class="botoes-modal">
    <button type="button" class="cancelar" @click="fecharModal">Cancelar</button>
    <button type="submit" class="cadastrar">Cadastrar</button>
  </div>

</form>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BarraLateral from '@/components/barraLateral.vue'
import Card from '@/components/Card.vue'

const store = useStore()
const router = useRouter()

const pacientes = ref([])
const mostrarModal = ref(false)

const novoPaciente = reactive({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  data_nascimento: ''
})

// ✅ BUSCAR PACIENTES
const carregarPacientes = async () => {
  try {
    const response = await api.get('/pacientes')
    pacientes.value = response.data
  } catch (erro) {
    console.error('Erro ao buscar pacientes:', erro.response?.data || erro)
  }
}


onMounted(() => {
  carregarPacientes()
})

// ✅ ABRIR / FECHAR MODAL
const abrirModal = () => {
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
}

// ✅ CADASTRAR PACIENTE
const cadastrarPaciente = async () => {
  try {
    await api.post('/pacientes', novoPaciente)

    alert('Paciente cadastrado com sucesso!')
    fecharModal()
    carregarPacientes()

    // ✅ limpa todos os campos do formulário
    Object.assign(novoPaciente, {
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      data_nascimento: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      convenio: '',
      numero_convenio: ''
    })
  } catch (erro) {
    console.error('Erro ao cadastrar paciente:', erro.response?.data || erro)
    alert('Erro ao cadastrar paciente')
  }
}


// ✅ NAVEGAÇÃO
const handleNavigate = (routeName) => {
  router.push(`/${routeName}`)
}

const handleLogout = () => {
  store.dispatch('auth/logout')
  router.push('/login')
}
</script>

<style scoped>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
}

body {
    background: #f5f6fa;
}

.container {
    display: flex;
}

/* SIDEBAR -------------------------------- */

.sidebar {
    width: 240px;
    background: #ffffff;
    height: 100vh;
    padding: 20px;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
}

/* LOGO */
.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
}

.logo .icon {
    width: 36px;
    height: 36px;
    background: #0a73ff;
    color: #fff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

  .logo h1 {
      font-size: 24px;
  }

  .logo span {
      font-size: 16px;
      color: #888;
  }

/* USER INFO */
.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
}

.avatar {
    background: #d8e3fc;
    color: #003399;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
}

/* MENU */
nav {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-grow: 1;
}

nav a {
    padding: 12px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
}

nav a:hover,
nav a.active {
    background: #e9f0ff;
    color: #0a73ff;
}

.logout {
    margin-top: auto;
    color: #444;
    cursor: pointer;
}

.header {
  display: flex;
  justify-content: space-between; 
  align-items: center;                     
}

.novo{
    background-color: #1a73e8;
    color: white;
    border: none;
    padding: 12px;
    font-size: 16px;
    width: auto;
    border-radius: 8px;
    cursor: pointer;
    display: flex;          
  align-items: center;     
  gap: 6px; 
}

.novo img{
    width: 16px;
    height: 16px;
}

/* MAIN -------------------------------- */

main {
    padding: 40px;
    flex-grow: 1;
}

.title {
    font-size: 28px;
    font-weight: 600;
}

.subtitle {
    color: #777;
}

/* CARDS */
.cards {
  display: flex;      
  gap: 20px;            
  flex-wrap: wrap; 
}

.card {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    flex: 1;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
}

.card h3 {
    font-size: 15px;
    color: #777;
    margin-bottom: 10px;
}

.card .value {
    font-size: 32px;
    font-weight: 600;
}

.growth.green {
    color: #10b981;
}

/* CONSULTAS -------------------------------- */

.consultas {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
}

.consulta {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;
}

.consulta:last-child {
    border-bottom: none;
}

.left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.circle {
    width: 42px;
    height: 42px;
    background: #e5e7eb;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
}

.right {
    display: flex;
    align-items: center;
    gap: 15px;
}

.hora {
    color: #666;
}

.status {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
}

.search-box input {
    width: 100%;
    padding: 12px 15px;
    margin: 20px 0;
    border: 1px solid #cfd8e3;
    border-radius: 8px;
}

.confirmada { background: #d1fae5; color: #065f46; }
.pendente { background: #fef9c3; color: #92400e; }
.cancelada { background: #fee2e2; color: #991b1b; }

/* ===== MODAL ===== */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 400px;
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal input,
.modal select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.botoes-modal {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.cancelar {
  background: #e5e7eb;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
}

.cadastrar {
  background: #1a73e8;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
}


</style>