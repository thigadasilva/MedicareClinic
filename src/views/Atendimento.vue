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
        <h2 class="title">Atendimentos (Prontuários)</h2>
        <button class="novo" @click="abrirModal">
          <img src="../assets/plus.png" />Registrar Prontuário
        </button>
      </div>
      <span class="subtitle">Registros médicos dos atendimentos realizados</span>

      <div class="search-box">
        <input v-model="busca" type="text" placeholder="Buscar prontuário pelo paciente..." />
      </div>

      <section class="atendimentos-container">
        <div class="atendimentos-list">
          <h3 class="section-title">Prontuários Registrados</h3>
          <div
            v-for="atendimento in atendimentosFiltrados"
            :key="atendimento.id"
            class="atendimento"
            :class="{ selected: atendimentoSelecionado?.id === atendimento.id }"
            @click="selecionarAtendimento(atendimento)"
          >
            <div class="icon user"></div>
            <div class="info">
              <h4>{{ atendimento.paciente }}</h4>
              <span>{{ formatarTipo(atendimento.tipo) }}</span>
            </div>
            <div class="time">{{ atendimento.hora }}</div>
            <span class="status" :class="atendimento.status">
              {{ formatarStatus(atendimento.status) }}
            </span>
          </div>
          <p v-if="!atendimentos.length">Nenhum prontuário registrado.</p>
        </div>

        <div v-if="atendimentoSelecionado" class="detalhes-atendimento">
          <h3>Detalhes do Prontuário</h3>
          <p><strong>Paciente:</strong> {{ atendimentoSelecionado.paciente }}</p>
          <p><strong>Médico:</strong> {{ atendimentoSelecionado.medico }}</p>
          <p><strong>Data da Consulta:</strong> {{ atendimentoSelecionado.data_consulta }}</p>
          <p><strong>Hora da Consulta:</strong> {{ atendimentoSelecionado.hora }}</p>
          <p><strong>Status da Consulta:</strong> {{ formatarStatus(atendimentoSelecionado.status) }}</p>
          
          <hr style="margin: 15px 0;">
          
          <h4>📝 Registro Médico</h4>
          <p><strong>Anamnese:</strong> {{ atendimentoSelecionado.anamnese || 'Não registrado' }}</p>
          <p><strong>Diagnóstico:</strong> {{ atendimentoSelecionado.diagnostico || 'Não registrado' }}</p>
          <p><strong>Prescrição:</strong> {{ atendimentoSelecionado.prescricao || 'Não registrado' }}</p>
          <p><strong>Exames Solicitados:</strong> {{ atendimentoSelecionado.exames_solicitados || 'Nenhum' }}</p>
          <p><strong>Retorno (dias):</strong> {{ atendimentoSelecionado.retorno_dias || 'Não definido' }}</p>

          <button class="excluir" @click="excluirAtendimento">Excluir Prontuário</button>
        </div>
      </section>

      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal">
          <h3>Registrar Prontuário</h3>
          <form @submit.prevent="cadastrarAtendimento">
            
            <label>Consulta a Registrar</label>
            <select v-model="novoAtendimento.consultaId" required>
              <option 
                v-for="c in consultasDisponiveis" 
                :key="c.id" 
                :value="c.id"
              >
                {{ c.data_formatada }} - {{ c.paciente.nome }} ({{ c.hora }}) - Status: {{ formatarStatus(c.status) }}
              </option>
            </select>
            <small v-if="!consultasDisponiveis.length" style="color: red;">
              Nenhuma consulta disponível para registro de prontuário (Status: Agendada, Confirmada ou Em Atendimento).
            </small>

            <label>Anamnese</label>
            <textarea v-model="novoAtendimento.anamnese" required></textarea>

            <label>Diagnóstico</label>
            <textarea v-model="novoAtendimento.diagnostico" required></textarea>

            <label>Prescrição</label>
            <textarea v-model="novoAtendimento.prescricao"></textarea>
            
            <label>Observações</label>
            <textarea v-model="novoAtendimento.observacoes"></textarea>

            <label>Exames Solicitados</label>
            <textarea v-model="novoAtendimento.exames_solicitados"></textarea>

            <label>Retorno (dias)</label>
            <input type="number" v-model="novoAtendimento.retorno_dias" />


            <div class="botoes-modal">
              <button type="button" class="cancelar" @click="fecharModal">Cancelar</button>
              <button type="submit" class="cadastrar" :disabled="!consultasDisponiveis.length">Registrar</button>
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
const atendimentos = ref([]) // Prontuários já registrados
const consultasDisponiveis = ref([]) // Consultas sem prontuário para registrar
const atendimentoSelecionado = ref(null)
const mostrarModal = ref(false)

// ✅ Os campos agora são de Prontuário (Atendimento)
const novoAtendimento = reactive({
  consultaId: '',
  anamnese: '',
  diagnostico: '',
  prescricao: '',
  observacoes: '',
  exames_solicitados: '',
  retorno_dias: null // Pode ser null ou number
})

// Função auxiliar para formatar a data
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// 1. Carrega os Prontuários (Atendimentos) já registrados pelo médico
const carregarAtendimentos = async () => {
  try {
    const res = await api.get('/atendimentos')
    atendimentos.value = res.data.map(a => {
      // ✅ MAPEAMENTO CORRIGIDO: Dados de exibição vêm da Consulta (a.Consulta)
      const consulta = a.Consulta || {}
      const paciente = consulta.Paciente || {}
      const medico = consulta.Profissional || {}
      
      return {
        id: a.id,
        consultaId: consulta.id, // Adicionado para uso futuro, se necessário
        paciente: paciente.nome || 'Paciente não informado',
        medico: medico.nome || 'Médico não informado',
        data_atendimento: formatDate(a.data_atendimento), // Data do registro do prontuário
        data_consulta: formatDate(consulta.data), // Data da Consulta
        hora: consulta.hora || 'N/A',
        tipo: consulta.tipo || 'N/A',
        status: consulta.status || 'desconhecido', // Status deve vir da Consulta
        anamnese: a.anamnese,
        diagnostico: a.diagnostico,
        prescricao: a.prescricao,
        observacoes: a.observacoes,
        exames_solicitados: a.exames_solicitados,
        retorno_dias: a.retorno_dias,
      }
    })
  } catch (error) {
    console.error('Erro ao carregar atendimentos:', error.response?.data || error)
  }
}

// 2. Carrega as Consultas que estão prontas para receber um Prontuário
const carregarConsultasDisponiveis = async () => {
  try {
    // ⚠️ Requer que você tenha um endpoint /consultas no backend que filtre
    // por status (agendada, confirmada, em_atendimento) E que não tenham atendimento
    // Para simplificar, vou assumir que existe um endpoint simples /consultas/medico
    
    // Supondo que você tem um endpoint que retorna as consultas do médico
    const res = await api.get('/consultas/pendentes') // ⚠️ Você pode precisar criar esse endpoint
    
    consultasDisponiveis.value = res.data
      .filter(c => ['agendada', 'confirmada', 'em_atendimento'].includes(c.status))
      .map(c => ({
        ...c,
        paciente: c.Paciente, // Assumindo que a Consulta inclui o Paciente
        data_formatada: formatDate(c.data),
      }))
      
    // Pré-seleciona o primeiro, se houver
    if (consultasDisponiveis.value.length > 0) {
      novoAtendimento.consultaId = consultasDisponiveis.value[0].id
    } else {
      novoAtendimento.consultaId = ''
    }
    
  } catch (error) {
    console.error('Erro ao carregar consultas disponíveis:', error.response?.data || error)
  }
}


const excluirAtendimento = async () => {
  if (!atendimentoSelecionado.value) return
  const confirmar = confirm("Tem certeza que deseja excluir este prontuário? A consulta original voltará ao status anterior.")
  if (!confirmar) return

  try {
    // ✅ Agora usa o Vuex Action
    const result = await store.dispatch('atendimentos/deleteAtendimento', atendimentoSelecionado.value.id)
    if (result.success) {
      alert("Prontuário excluído com sucesso! O status da consulta foi revertido.")
      carregarAtendimentos()
      carregarConsultasDisponiveis()
      atendimentoSelecionado.value = null
    } else {
      alert(result.message)
    }
  } catch (erro) {
    console.error(erro.response?.data || erro)
    alert("Erro ao excluir prontuário")
  }
}

const atendimentosFiltrados = computed(() =>
  atendimentos.value.filter(a => a.paciente.toLowerCase().includes(busca.value.toLowerCase()))
)

const abrirModal = () => { 
  carregarConsultasDisponiveis() // Carrega as opções antes de abrir
  mostrarModal.value = true 
}
const fecharModal = () => { 
  mostrarModal.value = false 
  // Limpar formulário
  Object.assign(novoAtendimento, {
    consultaId: consultasDisponiveis.value.length > 0 ? consultasDisponiveis.value[0].id : '',
    anamnese: '',
    diagnostico: '',
    prescricao: '',
    observacoes: '',
    exames_solicitados: '',
    retorno_dias: null
  })
}
const selecionarAtendimento = (atendimento) => { atendimentoSelecionado.value = atendimento }

// ✅ Ajustado para usar a action do Vuex e enviar os campos de prontuário
const cadastrarAtendimento = async () => {
  if (!novoAtendimento.consultaId) {
    alert('Selecione uma consulta para registrar o prontuário.')
    return
  }

  try {
    const result = await store.dispatch('atendimentos/createAtendimento', novoAtendimento)
    
    if (result.success) {
      alert('Prontuário registrado com sucesso! O status da consulta foi atualizado para "realizada".')
      fecharModal()
      carregarAtendimentos()
      carregarConsultasDisponiveis() // Atualiza a lista de pendentes
    } else {
      alert(result.message)
    }
  } catch (erro) {
    console.error(erro.response?.data || erro)
    alert('Erro ao registrar prontuário')
  }
}


onMounted(() => {
  // ✅ Carrega os atendimentos E as consultas disponíveis na inicialização
  carregarAtendimentos()
  carregarConsultasDisponiveis()
})

const formatarStatus = (status) => {
  if (status === 'agendada') return 'Agendada'
  if (status === 'confirmada') return 'Confirmada'
  if (status === 'em_atendimento') return 'Em Andamento'
  if (status === 'realizada') return 'Realizada'
  if (status === 'cancelada') return 'Cancelada'
  if (status === 'faltou') return 'Faltou'
  return status
}

const formatarTipo = (tipo) => {
  if (tipo === 'primeiro_atendimento') return 'Primeiro Atendimento'
  if (tipo === 'retorno') return 'Retorno'
  if (tipo === 'emergencia') return 'Emergência'
  return tipo
}

// NAVEGAÇÃO
const handleNavigate = (routeName) => {
  router.push(`/${routeName}`)
}

const handleLogout = () => {
  store.dispatch('auth/logout')
  router.push('/login')
}
</script>

<style scoped>
/* Seu CSS não precisa de alterações, apenas mude .consultas-container, .consultas-list e .detalhes-consulta para .atendimentos-container, .atendimentos-list e .detalhes-atendimento */
/* ... mantenha o CSS original com as classes ajustadas ... */

.atendimentos-container {
    display: flex;
    gap: 30px;
}

.atendimentos-list {
    background: #fff;
    flex: 2;
    padding: 20px;
    border-radius: 12px;
}

.detalhes-atendimento {
  background: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-top: 0; /* Ajuste se necessário */
  border-radius: 8px;
  flex: 1.2;
}

/* O resto do seu CSS (sem classes alteradas) continua aqui */

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


/* Lista de Consultas/Atendimentos */
.section-title {
    margin-bottom: 15px;
}

.atendimento {
    background: #f8f9ff;
    padding: 14px;
    margin-bottom: 12px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    cursor: pointer; /* Adicionado */
}

.atendimento.selected {
    background: #e9f2ff;
    border: 1px solid #b4d0ff;
}

.atendimento .icon.user {
    width: 36px;
    height: 36px;
    background: #d9e4f8;
    border-radius: 50%;
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
  width: 500px; /* Aumentado para melhor visualização do formulário */
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal input,
.modal select,
.modal textarea { /* Adicionado textarea */
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.botoes-modal {
  display: flex;
  justify-content: flex-end; /* Alinhado à direita */
  gap: 10px;
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