<template>
    <aside class="sidebar">
        <div class="brand">
            <div class="icon">+</div>
            <div>
                <h2>Medicare</h2>
                <span>Clínica</span>
            </div>
        </div>

        <div class="user-box">
            <div class="avatar">{{ username.charAt(0).toUpperCase()}}</div>
            <div>
                <p class="username">{{ username }}</p>
                <span class="role">{{ userRole }}</span>
            </div>
        </div>

        <nav class="menu">
          <a 
          v-for="item in rotasPermitidas"
          :key="item.name"
          href="#"
          class="item"
          @click="$emit('navigate', item.path)">
            {{ item.label }}
          </a>
        </nav>

        <button class="logout" @click="$emit('logout')">
            <span class="icon"><img src="../assets/logout.png"></span>
            <span>Sair</span>
        </button>
    </aside>

</template>
<script setup>
  import { computed } from 'vue'
  const props = defineProps({
  userRole: {
    type: String,
    required: true,
    default: ''
  },
  username: {
    type: String,
    required: true,
    default: ''
  }
})

const rotasPorCargo = {
    admin: [
        {name: 'dashboard', path: 'dashboard', label: 'Dashboard'},
        {name: 'agenda', path: 'agenda', label: 'Agenda'},
         {name: 'atendimento', path: 'atendimento', label: 'Atendimento'},
        {name: 'consultas', path: 'consultas', label: 'Consultas'},
        {name: 'pacientes', path: 'pacientes', label: 'Pacientes'},
        {name: 'medicos', path: 'medicos', label: 'Médicos'}    
    ],
    medico: [
        {name: 'agenda', path: 'agenda', label: 'Agenda'}      
    ],
    recepcionista: [
        {name: 'consultas', path: 'consultas', label: 'Consultas'}
    ]
}

const rotasPermitidas = computed(() => rotasPorCargo[props.userRole] || [])
</script>
<style>

.sidebar {
    width: 240px;
    background: #ffffff;
    padding: 20px;
    border-right: 1px solid #e2e2e2;
    height: 100vh;
    display: flex;
    flex-direction: column;
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
    margin-top: auto;
}


.logout:hover{
    background-color: #f3f4f6;
    border-radius: 8px;
}

.logout:hover span{
    color: #e63946;
}

</style>