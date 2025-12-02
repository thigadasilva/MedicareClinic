<template>
    <div class="agenda-container"></div>
    <h1>Agenda</h1>

 <CalendarComponent 
      :events="calendarEvents" 
      @event-clicked="handleEventClickFromCalendar" 
    />


    <button @click="handleLogout">Logout</button>
</template>
<script>
import CalendarComponent from '@/components/CalendarioComponente.vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {ref, onMounted} from 'vue';
import {parseISO, addMinutes} from 'date-fns';
import axios from 'axios';

  const router = useRouter()
  const calendarEvents = ref([])

  const handleEventClickFromCalendar = (eventId) => {
  console.log(`Evento ${eventId} clicado. Redirecionando...`);
  router.push(`/consultas/${eventId}/atendimento`); 
};

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
    const response = await axios.get('/api/agenda'); 
    const apiAppointments = response.data;

    calendarEvents.value = apiAppointments.map(appt => {
        const startDateTime = parseISO(`${appt.data_consulta}T${appt.hora_consulta}`);
        const endDateTime = addMinutes(startDateTime, 30); // RN06: +30 min

        return {
            title: `${appt.paciente.nome}`,
            start: startDateTime, 
            end: endDateTime,
            class: getStatusClass(appt.status), 
            id: appt.id
        };
    });

  } catch (error) {
    console.error("Erro ao carregar agenda:", error);
  }
};

onMounted(() => {
  fetchAppointments();
});

export default {
  setup() {
    const store = useStore()

    const handleLogout = () => {
      store.dispatch('auth/logout')
      router.push('/login') // redireciona para tela de login
    }

    return { handleLogout }
  }
}

</script>


<style scoped>
</style>