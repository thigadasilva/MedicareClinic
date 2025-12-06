<template>
    <div class="container">
         <BarraLateral
  :username="store.state.auth.user?.nome"
  :userRole="store.state.auth.user?.perfil"
  @navigate="handleNavigate"
  @logout="handleLogout"
   />

   <main>
       <h2 class="title">Médicos</h2>
        <p class="subtitle">Visão geral dos médicos do hospital</p>

<div class="search-box">
            <input type="text" placeholder="Buscar paciente..." />
        </div>

        <div class="cards">
            <Card
              title="Dra. Ana Santos"
              subtitle="Cardiologista"
              description="CRM: 12345"
              :actions="[{ label: 'Ver agenda', onClick: () => abrirAgenda('ana') }]"
            />
             <Card
              title="Dra. Carlos Souza"
              subtitle="Cardiologista"
              description="CRM: 12345"
              :actions="[{ label: 'Ver agenda', onClick: () => abrirAgenda('ana') }]"
            />
             <Card
              title="Dra. Ana Santos"
              subtitle="Cardiologista"
              description="CRM: 12345"
              :actions="[{ label: 'Ver agenda', onClick: () => abrirAgenda('ana') }]"
            />
        </div>
   </main>
    </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BarraLateral from '@/components/barraLateral.vue';
import Card from '@/components/Card.vue';

const store = useStore()
const router = useRouter()

const handleNavigate = (routeName) => {
  router.push(`/${routeName}`)
}
const handleLogout = () => {
      store.dispatch('auth/logout')
      router.push('/login') // redireciona para tela de login
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
    margin-bottom: 30px;
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

</style>