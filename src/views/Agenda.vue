<template>
   <div class="container">

   <BarraLateral
  :username="store.state.auth.user?.nome"
  :userRole="store.state.auth.user?.perfil"
  @navigate="handleNavigate"
  @logout="handleLogout"
   />
    <!-- Conteúdo principal -->
    <main class="main">
        <h1>Agenda</h1>
        <span class="subtitle">Atendimentos e registros médicos</span>

        <div class="search-box">
            <input type="text" placeholder="Buscar paciente..." />
        </div>

        <div class="agenda-container">

       <CalendarComponent 
      :events="calendarEvents" 
      @event-clicked="handleEventClickFromCalendar" 
    />
    </div>
   </main>
   </div>
</template>
<script setup>
import CalendarComponent from '@/components/CalendarioComponente.vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {ref, onMounted} from 'vue';
import {parseISO, addMinutes, parse} from 'date-fns';
import axios from 'axios';
import BarraLateral from '@/components/barraLateral.vue';

  
  const router = useRouter()
  const store = useStore()
  const calendarEvents = ref([])

  const handleEventClickFromCalendar = (eventId) => {
  console.log(`Evento ${eventId} clicado. Redirecionando...`);
  router.push(`/consultas/${eventId}/atendimento`); 
};

const handleNavigate = (routeName) => {
  router.push(`/${routeName}`)
}

const handleLogout = () => {
  store.dispatch('auth/logout')
  router.push('/login')
}


const getStatusClass = (status) => {
    switch (status) {
        case 'confirmada': return 'status-green';
        case 'agendada': return 'status-yellow';
        case 'cancelada': return 'status-red';
        default: return '';
    }
};

const buscarConsultas = async () => {
  try {
    const token = store.state.auth.token;

    if(!token){
      console.error("Token de autenticação não encontrado.");
      router.push('/login');
      return;
    }

    const response = await axios.get('/api/consultas', {
      headers:{
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Authorization': `Bearer ${token}`
      }
    }); 
    const apiConsultas= response.data;

       console.log('DEBUG: Tipo de dado recebido:', typeof apiConsultas);
    console.log('DEBUG: É um array?', Array.isArray(apiConsultas));
    console.log('DEBUG: Conteúdo da resposta:', apiConsultas);

       calendarEvents.value = apiConsultas.map(consulta => {
       const startDateTime = parse(`${consulta.data_consulta} ${consulta.hora_consulta}`, 'dd/MM/yyyy HH:mm', new Date())
       const endDateTime = addMinutes(startDateTime, 30); // RN06: +30 min

        return {
            title: `${consulta.paciente.nome}`,
            start: startDateTime, 
            end: endDateTime,
            class: getStatusClass(consulta.status), 
            id: consulta.id
        };
    });

  } catch (error) {
    console.error("Erro ao carregar agenda:", error);
  }
};

onMounted(() => {
  buscarConsultas();
});

</script>


<style scoped>
.agenda-container {
  padding: 20px;
}

.logout {
    margin-top: auto;
    color: #444;
    cursor: pointer;
}

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