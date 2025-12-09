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
    <h1>Consultas</h1>
    <button class="novo" @click="abrirModal">+ Nova Consulta</button>
  </div>
  <span class="subtitle">Atendimentos e registros médicos</span>

  <div class="search-box">
    <input v-model="busca" type="text" placeholder="Buscar paciente..." />
  </div>

  <section class="consultas-container">
    <!-- LISTA -->
    <div class="consultas-list">
      <h3 class="section-title">Consultas de Hoje</h3>
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
          <span>{{ consulta.tipo }}</span>
        </div>
        <div class="time">{{ consulta.hora }}</div>
        <span class="status" :class="consulta.status">
          {{ formatarStatus(consulta.status) }}
        </span>
      </div>
    </div>

    <!-- REGISTRO -->
    <div class="registro" v-if="consultaSelecionada">
      <h3>Registro de Atendimento</h3>
      <div class="registro-card">
        <h4>{{ consultaSelecionada.paciente }}</h4>
        <span>{{ consultaSelecionada.tipo }}</span>
        <span>{{ consultaSelecionada.hora }}</span>
      </div>
      <label>Observações</label>
      <textarea v-model="consultaSelecionada.observacoes"></textarea>
    </div>
    <div class="registro vazio" v-else>
      <h3>Selecione uma consulta</h3>
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
          <button type="button" @click="fecharModal">Cancelar</button>
          <button type="submit">Agendar</button>
        </div>
      </form>
    </div>
  </div>
</main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BarraLateral from '@/components/barraLateral.vue'

const store = useStore()
const router = useRouter()

const busca = ref('')
const consultaSelecionada = ref(null)

// ✅ MOCK DE CONSULTAS (enquanto não liga no backend)
const consultas = ref([
  { id: 1, paciente: 'Maria Silva', tipo: 'Consulta de Rotina', hora: '09:00', status: 'finalizada', observacoes: '' },
  { id: 2, paciente: 'Carlos Santos', tipo: 'Retorno', hora: '10:00', status: 'andamento', observacoes: '' },
  { id: 3, paciente: 'Ana Oliveira', tipo: 'Primeira Consulta', hora: '11:00', status: 'aguardando', observacoes: '' },
  { id: 4, paciente: 'José Lima', tipo: 'Exames', hora: '14:30', status: 'aguardando', observacoes: '' },
  { id: 5, paciente: 'Paula Costa', tipo: 'Consulta de Rotina', hora: '16:00', status: 'cancelada', observacoes: '' }
])

// ✅ FILTRO DE BUSCA
const consultasFiltradas = computed(() => {
  return consultas.value.filter(c =>
    c.paciente.toLowerCase().includes(busca.value.toLowerCase())
  )
})

// ✅ SELEÇÃO
const selecionarConsulta = (consulta) => {
  consultaSelecionada.value = consulta
}

// ✅ INICIAR CONSULTA
const iniciarConsulta = async (consulta) => {
  const token = store.state.auth.token

  await axios.patch(
    `http://localhost:3000/api/consultas/${consulta.id}/status`,    
    { status: 'andamento' },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  consulta.status = 'andamento'
}


const finalizarConsulta = async () => {
  const token = store.state.auth.token

  await axios.patch(
    `http://localhost:3000/api/consultas/${consultaSelecionada.value.id}/status`,
    { status: 'finalizada' },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  consultaSelecionada.value.status = 'finalizada'
  alert('Consulta finalizada!')
}


// ✅ FORMATA STATUS
const formatarStatus = (status) => {
  if (status === 'finalizada') return 'Finalizada'
  if (status === 'andamento') return 'Em Atendimento'
  if (status === 'aguardando') return 'Aguardando'
  return 'Cancelada'
}

// ✅ NAVEGAÇÃO
const handleNavigate = (routeName) => {
  router.push(`/${routeName}`)
}
const carregarConsultas = async () => {
  try {
    const token = store.state.auth.token

    const response = await axios.get(
      'http://localhost:3000/api/consultas',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    consultas.value = response.data.map(c => ({
      id: c.id,
      paciente: c.paciente.nome,
      tipo: c.tipo,
      hora: c.hora_consulta,
      status: c.status,
      observacoes: c.motivo || ''
    }))

  } catch (erro) {
    console.error('Erro ao buscar consultas:', erro.response?.data)
  }
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
}

.finalizada { color: #2ecc71; background: #d9f7e8; }
.andamento { color: #0a73ff; background: #dbe9ff; }
.aguardando { color: #e7a400; background: #fff2cd; }
.cancelada { color: #e74c3c; background: #ffe3df; }

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


</style>
