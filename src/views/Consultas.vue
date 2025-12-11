<template>
  <div class="container">
    <BarraLateral
      :username="store.state.auth.user?.nome"
      :userRole="store.state.auth.user?.perfil"
      @navigate="handleNavigate"
      @logout="handleLogout"
    />

    <main class="main">
  <div class="header">
    <h2 class="title">Consultas</h2>
    <button class="novo" @click="abrirModal">
          <img src="../assets/plus.png" />Nova Consulta
        </button>
    
  </div>
    <span class="subtitle">Atendimentos e registros médicos</span>
 

  <div class="search-box">
    <input v-model="busca" type="text" placeholder="Buscar consulta..." />
  </div>

  <section class="consultas-container">
    <div class="consultas-list">
      <h3 class="section-title">Consultas</h3>
      <div
        v-for="consulta in consultasFiltradas"
        :key="consulta.id"
        class="consulta"
        :class="{ selected: consultaSelecionada?.id === consulta.id }"
        @click="selecionarConsulta(consulta)"
      >
        <div class="icon user"></div>
        <div class="info">
          <h4>{{ consulta.paciente }}</h4>
          <span>{{formatarTipo(consulta.tipo)}}</span>
        </div>
        <div class="time">{{ consulta.hora }}</div>
        <span class="status" :class="consulta.status">
          {{ formatarStatus(consulta.status) }}
        </span>
      </div>
    </div>
    <div v-if="consultaSelecionada" class="detalhes-consulta">
  <h3>Detalhes da Consulta</h3>
  <p><strong>Paciente:</strong> {{ consultaSelecionada.paciente }}</p>
  <p><strong>Médico:</strong> {{ consultaSelecionada.medico }}</p>
  <p><strong>Data:</strong> {{ consultaSelecionada.data_consulta }}</p>
  <p><strong>Hora:</strong> {{ consultaSelecionada.hora }}</p>
  <p><strong>Tipo:</strong> {{ consultaSelecionada.tipo }}</p>
  <p><strong>Status:</strong> {{ formatarStatus(consultaSelecionada.status) }}</p>
  <p><strong>Motivo:</strong> {{ consultaSelecionada.motivo || 'Não informado' }}</p>

  <div class="acoes-consulta">
    <button @click="atualizarStatus('confirmada')">Confirmar</button>
    <button @click="atualizarStatus('em_atendimento')">Iniciar Atendimento</button>
    <button @click="atualizarStatus('realizada')">Finalizar</button>
    <button @click="atualizarStatus('cancelada')">Cancelar</button>
  </div>
    <button class="excluir" @click="excluirConsulta">Excluir</button>
</div>
  </section>

  <!-- ✅ MODAL DE NOVA CONSULTA -->
  <div v-if="mostrarModal" class="modal-overlay">
    <div class="modal">
      <h3>Agendar Nova Consulta</h3>
      <form @submit.prevent="cadastrarConsulta">
        <label>Paciente</label>
        <select v-model="novaConsulta.pacienteId" required>
          <option v-for="p in pacientes" :key="p.id" :value="p.id">{{ p.nome }}</option>
        </select>

        <label>Médico</label>
        <select v-model="novaConsulta.medicoId" required>
          <option v-for="m in medicos" :key="m.id" :value="m.id">{{ m.nome }} - {{ m.especialidade }}</option>
        </select>

        <label>Data</label>
        <input type="date" v-model="novaConsulta.data_consulta" required />

        <label>Hora</label>
        <input type="time" v-model="novaConsulta.hora_consulta" required />

        <label>Tipo</label>
        <select v-model="novaConsulta.tipo" required>
          <option value="primeira_consulta">Primeira Consulta</option>
          <option value="retorno">Retorno</option>
          <option value="emergencia">Emergência</option>
        </select>

        <label>Motivo</label>
        <textarea v-model="novaConsulta.motivo"></textarea>

        <div class="botoes-modal">
          <button type="button" class="cancelar" @click="fecharModal">Cancelar</button>
          <button type="submit" class="cadastrar">Agendar</button>

          
        </div>
      </form>
    </div>
  </div>
</main>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/services/api.js' 
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BarraLateral from '@/components/barraLateral.vue'

const store = useStore()
const router = useRouter()

const busca = ref('')
const consultaSelecionada = ref(null)
const consultas = ref([])
const mostrarModal = ref(false)

const novaConsulta = reactive({
  pacienteId: '',
  medicoId: '',
  data_consulta: '',
  hora_consulta: '',
  tipo: '',
  motivo: ''
})

const pacientes = ref([])
const medicos = ref([])

const carregarPacientes = async () => {
  const res = await api.get('/api/pacientes')
  pacientes.value = res.data
}
const carregarMedicos = async () => {
  const res = await api.get('/api/profissionais/medicos')
  medicos.value = res.data
}

const formatarTipo = (tipo) => {
  if (tipo === 'primeira_consulta') return 'Primeira Consulta'
  if (tipo === 'retorno') return 'Retorno'
  if (tipo === 'emergencia') return 'Emergência'
  if (tipo === 'consulta') return 'Consulta'
  return tipo   // fallback: mostra o valor cru
}

const carregarConsultas = async () => {
  try {
    const response = await api.get('/api/consultas')
    consultas.value = response.data.map(c => ({
      id: c.id,
      paciente: c.paciente?.nome || 'Paciente não informado',
      medico: c.medico?.nome || 'Médico não informado',
      data_consulta: c.data_consulta,  
      tipo: c.tipo,
      hora: c.hora_consulta,
      status: c.status,
      motivo: c.motivo
    }))
  } catch (erro) {
    console.error('Erro ao buscar consultas:', erro.response?.data || erro)
  }
}

const atualizarStatus = async (novoStatus) => {
  try {
    await api.patch(`/api/consultas/${consultaSelecionada.value.id}/status`, {
      status: novoStatus
    })
    alert(`Consulta ${novoStatus} com sucesso!`)
    carregarConsultas()
    consultaSelecionada.value = null
  } catch (erro) {
    console.error(erro.response?.data || erro)
    alert('Erro ao atualizar status da consulta')
  }
}

const excluirConsulta = async () => {
  if (!consultaSelecionada.value) return
  const confirmar = confirm("Tem certeza que deseja excluir esta consulta?")
  if (!confirmar) return

  try {
    await api.delete(`/api/consultas/${consultaSelecionada.value.id}`)
    alert("Consulta excluída com sucesso!")
    carregarConsultas()
    consultaSelecionada.value = null
  } catch (erro) {
    console.error(erro.response?.data || erro)
    alert("Erro ao excluir consulta")
  }
}


const consultasFiltradas = computed(() =>
  consultas.value.filter(c => c.paciente.toLowerCase().includes(busca.value.toLowerCase()))
)

const abrirModal = () => { mostrarModal.value = true }
const fecharModal = () => { mostrarModal.value = false }

// ✅ SELEÇÃO
const selecionarConsulta = (consulta) => { consultaSelecionada.value = consulta }

// ✅ INICIAR CONSULTA
const cadastrarConsulta = async () => {
  try {
    await api.post('/consultas', {
      pacienteId: novaConsulta.pacienteId,
      medicoId: novaConsulta.medicoId,
      data_consulta: novaConsulta.data_consulta,
      hora_consulta: novaConsulta.hora_consulta,
      tipo: novaConsulta.tipo,
      motivo: novaConsulta.motivo
    })
    alert('Consulta agendada com sucesso!')
    fecharModal()
    carregarConsultas()
  } catch (erro) {
    console.error(erro.response?.data || erro)
    alert('Erro ao agendar consulta')
  }
}

onMounted(() => {
  carregarConsultas()
  carregarPacientes()
  carregarMedicos()
})

// ✅ FORMATA STATUS
const formatarStatus = (status) => {
  if (status === 'agendada') return 'Agendada'
  if (status === 'confirmada') return 'Confirmada'
  if (status === 'em_atendimento') return 'Em Atendimento'
  if (status === 'realizada') return 'Finalizada'
  if (status === 'cancelada') return 'Cancelada'
  if (status === 'faltou') return 'Faltou'
  return status   // fallback: mostra o valor cru
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
    font-family: Arial, Helvetica, sans-serif;
}

body {
    background: #f4f6fb;
}

.container {
    display: flex;
}

/* Sidebar */
.sidebar {
    width: 240px;
    background: #ffffff;
    padding: 20px;
    border-right: 1px solid #e2e2e2;
    height: 100vh;
    position: fixed;
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
}

.brand .icon {
    background: #0a73ff;
    color: #fff;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    font-size: 24px;
}

.user-box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
}

.user-box .avatar {
    background: #d8e3fc;
    color: #003399;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-weight: bold;
}

.username {
    font-weight: bold;
}

.header {
  display: flex;
  justify-content: space-between; 
  align-items: center;          
      
}

.title {
    font-size: 28px;
    font-weight: 600;
}


.role {
    font-size: 12px;
    color: #666;
}

.menu .item {
    display: block;
    padding: 12px 10px;
    border-radius: 8px;
    color: #333;
    text-decoration: none;
    margin-bottom: 8px;
}

.menu .item:hover,
.menu .item.active {
    background: #e9f0ff;
    color: #0a73ff;
}

.logout {
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
    background: transparent;
    padding: 12px 16px;
    font-size: 16px;
    color: #6b7280; /* cinza igual ao da sua imagem */
    cursor: pointer;
}


.logout:hover{
    background-color: #f3f4f6;
    border-radius: 8px;
}

.logout:hover span{
    color: #e63946;
}

/* Main */
.main {
    margin-left: 260px;
    padding: 30px;
    width: calc(100% - 260px);
}

.subtitle {
    color: #777;
    font-size: 14px;
}

.search-box input {
    width: 100%;
    padding: 12px 15px;
    margin: 20px 0;
    border: 1px solid #cfd8e3;
    border-radius: 8px;
}

.consultas-container {
    display: flex;
    gap: 30px;
}

/* Lista de Consultas */
.consultas-list {
    background: #fff;
    flex: 2;
    padding: 20px;
    border-radius: 12px;
}

.section-title {
    margin-bottom: 15px;
}

.consulta {
    background: #f8f9ff;
    padding: 14px;
    margin-bottom: 12px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
}

.consulta.selected {
    background: #e9f2ff;
    border: 1px solid #b4d0ff;
}

.consulta .icon.user {
    width: 36px;
    height: 36px;
    background: #d9e4f8;
    border-radius: 50%;
}

.detalhes-consulta {
  background: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
}

.acoes-consulta {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.acoes-consulta button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.excluir {
  background-color: #e74c3c; /* vermelho */
  color: #fff;
  border: none;
  padding: 10px 30px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 12px;         /* espaço extra acima */
  align-self: flex-end;     /* alinha à direita dentro do flex */
}

.excluir:hover {
  background-color: #c0392b; 
}
.info span {
    font-size: 13px;
    color: #666;
}
.time {
    margin-left: auto;
    margin-right: 10px;
    color: #333;
}

.status {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 8px;
    font-weight: 600;
}

/* Status possíveis */
.agendada { 
    color: #1a73e8; 
    background: #e9f0ff; 
}

.confirmada { 
    color: #0a9955; 
    background: #d9f7e8; 
}

.em_atendimento { 
    color: #ff9800; 
    background: #fff2cd; 
}

.realizada { 
    color: #2ecc71; 
    background: #d9f7e8; 
}

.cancelada { 
    color: #e74c3c; 
    background: #ffe3df; 
}

.faltou { 
    color: #e63946; 
    background: #f3e5f5; 
}


.btn {
    background: #0a73ff;
    color: #fff;
    border: none;
    padding: 6px 14px;
    border-radius: 8px;
    cursor: pointer;
}

/* Painel de Atendimento */
.registro {
    flex: 1.2;
    background: #fff;
    padding: 20px;
    border-radius: 12px;
}

.registro-card {
    background: #f6f8fc;
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
}

textarea {
    width: 100%;
    height: 120px;
    padding: 12px;
    border: 1px solid #d6d6d6;
    border-radius: 10px;
    resize: none;
}

.btn-success {
    margin-top: 20px;
    width: 100%;
    background: #2ecc71;
    color: #fff;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
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
    margin-left: auto;
    display: flex;          
  align-items: center;     
  gap: 6px; 
}

.novo img{
    width: 16px;
    height: 16px;
}


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
  cursor: pointer;
}

.cadastrar {
  background: #1a73e8;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

</style>
