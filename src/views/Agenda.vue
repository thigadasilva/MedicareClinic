<template>
    <div class="agenda-container">
    <h1>Agenda</h1>

       <CalendarComponent 
      :events="calendarEvents" 
      @event-clicked="handleEventClickFromCalendar" 
    />
      
      <button @click="handleLogout">Logout</button>
    </div>
</template>
<script setup>
import CalendarComponent from '@/components/CalendarioComponente.vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {ref, onMounted} from 'vue';
import {addMinutes, parse} from 'date-fns';
import axios from 'axios';

  const router = useRouter()
  const store = useStore()
  const calendarEvents = ref([])

  const handleEventClickFromCalendar = (eventId) => {
  console.log(`Evento ${eventId} clicado. Redirecionando...`);
  router.push(`/consultas/${eventId}/atendimento`); 
};

 const handleLogout = () => {
      store.dispatch('auth/logout')
      router.push('/login') // redireciona para tela de login
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


    calendarEvents.value = apiConsultas.map(consulta => {
        const startStringBR = `${consulta.data_consulta} ${consulta.hora_consulta}`;
        const startDateTime = parse(startStringBR, 'dd/MM/yyyy HH:mm', new Date());
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
</style>