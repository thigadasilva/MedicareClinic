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
        <h2 class="title">Médicos</h2>

        <button class="novo" @click="abrirModal">
          <img src="../assets/plus.png" />Novo Médico
        </button>
      </div>

      <p class="subtitle">Visão geral dos médicos do hospital</p>

      <div class="search-box">
        <input v-model="busca" type="text" placeholder="Buscar médico..." />
      </div>

      <div class="cards">
        <Card
          v-for="medico in medicosFiltrados"
          :key="medico.id"
          :title="medico.nome"
          :subtitle="medico.especialidade"
          :description="`CRM: ${medico.crm}`"
          :actions="[
             { label: 'Editar', onClick: () => abrirModalEditar(medico), class: 'editar' },
             { label: 'Excluir', onClick: () => excluirMedico(medico.id), class: 'excluir' },
             { label: 'Detalhes', onClick: () => abrirModalDetalhes(medico), class: 'detalhes' }
          ]"  
        > 
        </Card>
      </div>
      <div v-if="medicoDetalhes" class="modal-overlay">
  <div class="modal">
    <h3>Detalhes do Médico</h3>
    <p><strong>Nome:</strong> {{ medicoDetalhes.nome }}</p>
    <p><strong>CRM:</strong> {{ medicoDetalhes.crm }}</p>
    <p><strong>Especialidade:</strong> {{ medicoDetalhes.especialidade }}</p>
    <p><strong>Email:</strong> {{ medicoDetalhes.email }}</p>
    <p><strong>Telefone:</strong> Não aplicável</p>
    <p><strong>Status:</strong> {{ medicoDetalhes.status ? 'Ativo' : 'Inativo' }}</p>

    <div class="botoes-modal">
      <button type="button" class="cancelar" @click="fecharModalDetalhes">Fechar</button>
    </div>
  </div>
</div>
    </main>

    <!-- ✅ MODAL DE CADASTRO/EDIÇÃO -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal">

        <h3>{{ medicoEditando ? 'Editar Médico' : 'Novo Médico' }}</h3>

        <form @submit.prevent="medicoEditando ? atualizarMedico() : cadastrar()">

         <label>Nome Completo *</label>
         <input v-model="formMedico.nome" required />

         <label>CRM *</label>
         <input v-model="formMedico.crm" required />

         <label>Especialidade *</label>
        <select v-model="formMedico.especialidade" required>
          <option>Cardiologia</option>
          <option>Clínico Geral</option>
          <option>Ortopedia</option>
          <option>Pediatria</option>
        </select>

        <label>E-mail</label>
        <input v-model="formMedico.email" />

        <label>Telefone</label>
        <input v-model="formMedico.telefone" />

          <div class="botoes-modal">
            <button type="button" class="cancelar" @click="fecharModal">Cancelar</button>
            <button type="submit" class="cadastrar">
              {{ medicoEditando ? 'Salvar Alterações' : 'Cadastrar' }}
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

const medicos = ref([])
const mostrarModal = ref(false)
const medicoEditando = ref(null)

const novoMedico = reactive({
  nome: '',
  crm: '',
  especialidade: '',
  email: '',
  telefone: '',
  senha: 'Med@123',
  perfil: 'medico'
})

// no script
const formMedico = computed(() => medicoEditando.value || novoMedico)


// ✅ BUSCAR MÉDICOS
const carregarMedicos = async () => {
  try {
    const response = await api.get('/api/profissionais/medicos')
    medicos.value = response.data.map(m => ({ ...m, mostrarDetalhes: false }))
  } catch (erro) {
    console.error('Erro ao buscar medicos:', erro.response?.data || erro)
  }
}

onMounted(() => {
  carregarMedicos()
})

const medicoDetalhes = ref(null)
const abrirModalDetalhes = async (medico) => {
  try {
    // busca os dados completos do médico pelo ID
    const response = await api.get(`/api/profissionais/${medico.id}`)
     console.log(response.data)
    medicoDetalhes.value = response.data
  } catch (erro) {
    console.error('Erro ao buscar detalhes do médico:', erro.response?.data || erro)
    alert('Erro ao carregar detalhes do médico')
  }
}
const fecharModalDetalhes = () => {
  medicoDetalhes.value = null
}

const busca = ref('')

const medicosFiltrados = computed(() => {
  if (!busca.value) return medicos.value
  return medicos.value.filter(m =>
    m.nome.toLowerCase().includes(busca.value.toLowerCase()) ||
    m.especialidade.toLowerCase().includes(busca.value.toLowerCase()) ||
    m.crm.toLowerCase().includes(busca.value.toLowerCase())
  )
})

// ✅ ABRIR / FECHAR MODAL
const abrirModal = () => {
  medicoEditando.value = null
  mostrarModal.value = true
}
const abrirModalEditar = (medico) => {
  medicoEditando.value = { ...medico }
  mostrarModal.value = true
}
const fecharModal = () => {
  mostrarModal.value = false
  medicoEditando.value = null
}

// ✅ CADASTRAR MÉDICO
const cadastrar = async () => {
  try {
    await api.post('/api/profissionais', novoMedico)
    alert('Médico cadastrado com sucesso!')
    fecharModal()
    carregarMedicos()
    Object.assign(novoMedico, { nome: '', crm: '', especialidade: '', email: '', telefone: '' })
  } catch (erro) {
    console.error(erro)
    alert('Erro ao cadastrar médico')
  }
}

// ✅ ATUALIZAR MÉDICO
const atualizarMedico = async () => {
  try {
    await api.patch(`/api/profissionais/${medicoEditando.value.id}`, medicoEditando.value)
    alert('Médico atualizado com sucesso!')
    fecharModal()
    carregarMedicos()
  } catch (erro) {
    console.error(erro)
    alert('Erro ao atualizar médico')
  }
}

// ✅ EXCLUIR MÉDICO
const excluirMedico = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este médico?')) return
  try {
    await api.delete(`/api/profissionais/${id}`)
    alert('Médico excluído com sucesso!')
    carregarMedicos()
  } catch (erro) {
    console.error(erro)
    alert('Erro ao excluir médico')
  }
}


// ✅ NAVEGAÇÃO
const handleNavigate = (routeName) => router.push(`/${routeName}`)
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
    margin-left: auto;
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

.card-actions button {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-right: 6px;
}
.editar { background: #fbbf24; color: #fff; }
.excluir { background: #ef4444; color: #fff; }
.detalhes { background: #3b82f6; color: #fff; }


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