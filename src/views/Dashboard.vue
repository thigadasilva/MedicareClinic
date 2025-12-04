<template>
<div class="container">

    <!-- SIDEBAR -->
    <aside class="sidebar">
        <div class="logo">
            <div class="icon">+</div>
            <div>
                <h1>MediPlus</h1>
                <span>Clínica</span>
            </div>
        </div>

        <div class="user-info">
            <div class="avatar">DC</div>
            <div>
                <h3>Dr. Carlos Admin</h3>
                <span>Administrador</span>
            </div>
        </div>

        <nav>
            <a class="active">Dashboard</a>
            <a @click="handleAgenda">Agenda</a>
            <a @click="handleConsultas">Consultas</a>
            <a>Pacientes</a>
            <a>Médicos</a>
        </nav>
        <button class="logout" @click="handleLogout">Logout</button>

    </aside>

    <!-- MAIN -->
    <main>

        <h2 class="title">Dashboard</h2>
        <p class="subtitle">Visão geral da clínica</p>
       
        

        <!-- CONSULTAS -->
        <section class="consultas">
            <h3 class="section-title">Consultas de Hoje</h3>

            <div class="consulta">
                <div class="left">
                    <div class="circle">MS</div>
                    <div>
                        <strong>Maria Silva</strong>
                        <p>Dr. João</p>
                    </div>
                </div>
                <div class="right">
                    <span class="hora">09:00</span>
                    <span class="status confirmada">Confirmada</span>
                </div>
            </div>

            <div class="consulta">
                <div class="left">
                    <div class="circle">CS</div>
                    <div>
                        <strong>Carlos Santos</strong>
                        <p>Dra. Ana</p>
                    </div>
                </div>
                <div class="right">
                    <span class="hora">09:30</span>
                    <span class="status confirmada">Confirmada</span>
                </div>
            </div>

            <div class="consulta">
                <div class="left">
                    <div class="circle">AO</div>
                    <div>
                        <strong>Ana Oliveira</strong>
                        <p>Dr. Pedro</p>
                    </div>
                </div>
                <div class="right">
                    <span class="hora">10:00</span>
                    <span class="status pendente">Pendente</span>
                </div>
            </div>

            <div class="consulta">
                <div class="left">
                    <div class="circle">JL</div>
                    <div>
                        <strong>José Lima</strong>
                        <p>Dr. João</p>
                    </div>
                </div>
                <div class="right">
                    <span class="hora">10:30</span>
                    <span class="status confirmada">Confirmada</span>
                </div>
            </div>

            <div class="consulta">
                <div class="left">
                    <div class="circle">PC</div>
                    <div>
                        <strong>Paula Costa</strong>
                        <p>Dra. Ana</p>
                    </div>
                </div>
                <div class="right">
                    <span class="hora">11:00</span>
                    <span class="status cancelada">Cancelada</span>
                </div>
            </div>

        </section>

    </main>
    </div>
    </template>
<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
 
    const handleConsultas = () =>{
        router.push('/consultas')
    }

const handleAgenda = () =>{
        router.push('/agenda')
    }

    const handleLogout = () => {
      store.dispatch('auth/logout')
      router.push('/login') // redireciona para tela de login
    }

    return { handleLogout,
         handleConsultas,
         handleAgenda
     }
  }
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
    width: 260px;
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
    background: #3b82f6;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}

.logo h1 {
    font-size: 20px;
    font-weight: 600;
}

.logo span {
    font-size: 12px;
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
    background: #d1d5db;
    width: 38px;
    height: 38px;
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
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
}

nav a:hover,
nav a.active {
    background: #e5e7eb;
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
    margin-bottom: 40px;
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

.confirmada { background: #d1fae5; color: #065f46; }
.pendente { background: #fef9c3; color: #92400e; }
.cancelada { background: #fee2e2; color: #991b1b; }

</style>


