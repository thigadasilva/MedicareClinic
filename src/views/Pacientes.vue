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
        <input v-model="busca" type="text" placeholder="Buscar paciente..." />
      </div>

      <div class="cards">
        <Card
          v-for="paciente in pacientesFiltrados"
          :key="paciente.id"
          :title="paciente.nome"
          :subtitle="`Email: ${paciente.email}`"
          :description="`Telefone: ${paciente.telefone}`"
          :actions="[
             { label: 'Editar', onClick: () => abrirModalEditar(paciente), class: 'editar' },
             { label: 'Excluir', onClick: () => excluirPaciente(paciente.id), class: 'excluir' },
             { label: 'Detalhes', onClick: () => abrirModalDetalhes(paciente), class: 'detalhes' }
          ]"  
        > 
        </Card>
      </div>
    </main>

    <div v-if="pacienteDetalhes" class="modal-overlay">
  <div class="modal">
    <h3>Detalhes do Paciente</h3>
    
    <p><strong>Nome:</strong> {{ pacienteDetalhes.nome }}</p>
    <p><strong>CPF:</strong> {{ pacienteDetalhes.cpf }}</p>
    <p><strong>Email:</strong> {{ pacienteDetalhes.email || 'Não informado' }}</p>
    <p><strong>Telefone:</strong> {{ pacienteDetalhes.telefone || 'Não informado' }}</p>
    <p><strong>Status:</strong> {{ pacienteDetalhes.ativo ? 'Ativo' : 'Inativo' }}</p>
    <p><strong>Endereço:</strong> {{ pacienteDetalhes.endereco}}</p>
    <p><strong>CEP:</strong> {{ pacienteDetalhes.cep }}</p>

    <div class="botoes-modal">
      <button type="button" class="cancelar" @click="fecharModalDetalhes">Fechar</button>
    </div>
  </div>
</div>

  <div v-if="mostrarModal" class="modal-overlay">
  <div class="modal">
    <h3>Novo Paciente</h3>

    <form @submit.prevent="cadastrarPaciente">
      <!-- Etapa 1 -->
      <div v-if="etapaAtual === 1">
        <label>Nome Completo *</label>
        <input v-model="novoPaciente.nome" required />

        <label>CPF *</label>
        <input v-model="novoPaciente.cpf" required />

        <label>Data de Nascimento *</label>
        <input type="date" v-model="novoPaciente.data_nascimento" required />
      </div>

      <!-- Etapa 2 -->
      <div v-if="etapaAtual === 2">
        <label>E-mail</label>
        <input v-model="novoPaciente.email" required/>

        <label>Telefone</label>
        <input v-model="novoPaciente.telefone" required/>

        <label>Endereço</label>
        <input v-model="novoPaciente.endereco" required/>

        <label>Cidade</label>
        <input v-model="novoPaciente.cidade" required/>

        <label>Estado</label>
        <input v-model="novoPaciente.estado" required/>

        <label>CEP</label>
        <input v-model="novoPaciente.cep" required/>
      </div>

      <!-- Etapa 3 -->
      <div v-if="etapaAtual === 3">
        <label>Convênio</label>
        <input v-model="novoPaciente.convenio" required/>

        <label>Número do Convênio</label>
        <input v-model="novoPaciente.numero_convenio" required/>
      </div>

      <div class="botoes-modal">
  <button type="button" class="cancelar" @click="fecharModal">Cancelar</button>
  <button type="button" class="voltar" @click="etapaAtual--" v-if="etapaAtual > 1">Voltar</button>
  <button type="button" class="proximo" @click="etapaAtual++" v-if="etapaAtual < 3" :disabled="!validarEtapa()">
  Próximo
</button>
<button type="submit" class="cadastrar" v-if="etapaAtual === 3" :disabled="!validarEtapa()">
  Cadastrar
</button>
</div>
    </form>
  </div>
</div>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import api from '@/services/api.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BarraLateral from '@/components/barraLateral.vue'
import Card from '@/components/Card.vue'

const store = useStore()
const router = useRouter()

const pacientes = ref([])
const mostrarModal = ref(false)
const pacienteEditando = ref(null)
const etapaAtual = ref(1)


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
    const response = await api.get('/api/pacientes')
    pacientes.value = response.data
  } catch (erro) {
    console.error('Erro ao buscar pacientes:', erro.response?.data || erro)
  }
}


onMounted(() => {
  carregarPacientes()
})

const validarEtapa = () => {
  if (etapaAtual.value === 1) {
    return novoPaciente.nome && novoPaciente.cpf && novoPaciente.data_nascimento
  }
  if (etapaAtual.value === 2) {
    return novoPaciente.email && novoPaciente.telefone && novoPaciente.endereco &&
           novoPaciente.cidade && novoPaciente.estado && novoPaciente.cep
  }
  if (etapaAtual.value === 3) {
    return novoPaciente.convenio && novoPaciente.numero_convenio
  }
  return true
}

const busca = ref('')

const pacientesFiltrados = computed(() => {
  if (!busca.value) return pacientes.value
  return pacientes.value.filter(p =>
    p.nome.toLowerCase().includes(busca.value.toLowerCase()) ||
    p.cpf.toLowerCase().includes(busca.value.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(busca.value.toLowerCase()))
  )
})

const pacienteDetalhes = ref(null)

const abrirModalDetalhes = async (paciente) => {
  try {
    const response = await api.get(`/api/pacientes/${paciente.id}`)
    pacienteDetalhes.value = response.data
  } catch (erro) {
    console.error('Erro ao buscar detalhes do paciente:', erro.response?.data || erro)
    alert('Erro ao carregar detalhes do paciente')
  }
}

const fecharModalDetalhes = () => {
  pacienteDetalhes.value = null
}


// ✅ ABRIR / FECHAR MODAL
const abrirModal = () => {
  mostrarModal.value = true
}

const abrirModalEditar = (paciente) => {
  pacienteEditando.value = { ...paciente }
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
}

// ✅ CADASTRAR PACIENTE
const cadastrarPaciente = async () => {
  try {
    await api.post('/api/pacientes', novoPaciente)

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

// ✅ EXCLUIR MÉDICO
const excluirPaciente = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este paciente?')) return
  try {
    await api.delete(`/pacientes/${id}`)
    alert('Paciente excluído com sucesso!')
    carregarPacientes()
  } catch (erro) {
    console.error(erro)
    alert('Erro ao excluir paciente')
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
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15); /* sombra suave */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.modal h3 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50; /* azul escuro elegante */
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.modal p {
  margin: 10px 0;
  font-size: 15px;
  line-height: 1.4;
}

.modal strong {
  color: #34495e; /* destaque no label */
}

.modal p:last-child {
  margin-top: 15px;
  font-weight: 500;
  color: #27ae60; /* verde para status ativo */
}

.modal p:last-child.inativo {
  color: #e74c3c; /* vermelho para status inativo */
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 12px; /* espaço entre os campos */
}

.modal label {
  font-weight: 500;
  margin-bottom: 4px;
}

.modal input,
.modal select {
  width: 100%;
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
  color: #333;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.voltar {
  background: #999;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.proximo {
  background: #1a73e8;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.cadastrar {
  background: #10b981;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.proximo:disabled,
.cadastrar:disabled {
  background: #ccc;
  cursor: not-allowed;
}


</style>