<template>
  <div class="container">

    <!-- Sidebar -->
    <aside class="sidebar">

      <!-- BRAND -->
      <div class="brand">
        <div class="icon">+</div>
        <div>
          <h2>Medicare</h2>
          <span>Clínica</span>
        </div>
      </div>

      <!-- USER -->
      <div class="user-box">
        <div class="avatar">DC</div>
        <div>
          <p class="username">Dr. Carlos Admin</p>
          <span class="role">Administrador</span>
        </div>
      </div>

      <!-- MENU -->
      <nav class="menu">
        <a class="item active">Dashboard</a>
        <a class="item" @click="handleAgenda">Agenda</a>
        <a class="item" @click="handleConsultas">Consultas</a>
        <a class="item">Pacientes</a>
        <a class="item">Médicos</a>
      </nav>

      <!-- Divider -->
      <div class="sidebar-divider"></div>

      <!-- LOGOUT -->
      <button class="logout" @click="handleLogout">
        <span class="logout-icon">⟵</span>
        <span> Sair </span>
      </button>

    </aside>

    <!-- MAIN -->
    <main class="main">

      <h1>Dashboard</h1>
      <span class="subtitle">Visão geral da clínica</span>

      <!-- CONSULTAS -->
      <section class="consultas-container">

        <div class="consultas-list">
          <h3 class="section-title">Consultas de Hoje</h3>

          <div class="consulta">
            <div class="circle">MS</div>
            <div class="info">
              <h4>Maria Silva</h4>
              <span>Dr. João</span>
            </div>
            <span class="time">09:00</span>
            <span class="status finalizada">Confirmada</span>
          </div>

          <div class="consulta">
            <div class="circle">CS</div>
            <div class="info">
              <h4>Carlos Santos</h4>
              <span>Dra. Ana</span>
            </div>
            <span class="time">09:30</span>
            <span class="status finalizada">Confirmada</span>
          </div>

          <div class="consulta">
            <div class="circle">AO</div>
            <div class="info">
              <h4>Ana Oliveira</h4>
              <span>Dr. Pedro</span>
            </div>
            <span class="time">10:00</span>
            <span class="status andamento">Pendente</span>
          </div>

          <div class="consulta">
            <div class="circle">JL</div>
            <div class="info">
              <h4>José Lima</h4>
              <span>Dr. João</span>
            </div>
            <span class="time">10:30</span>
            <span class="status finalizada">Confirmada</span>
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

    const handleConsultas = () => router.push('/consultas')
    const handleAgenda = () => router.push('/agenda')

    const handleLogout = () => {
      store.dispatch('auth/logout')
      router.push('/login')
    }

    return { handleLogout, handleConsultas, handleAgenda }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

.container {
  display: flex;
}

/* SIDEBAR */
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

/* USER */
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

/* MENU */
.menu .item {
  display: block;
  padding: 12px 10px;
  border-radius: 8px;
  color: #333;
  text-decoration: none;
  margin-bottom: 8px;
  cursor: pointer;
}

.menu .item:hover,
.menu .item.active {
  background: #e9f0ff;
  color: #0a73ff;
}

/* Divider */
.sidebar-divider {
  width: 100%;
  height: 1px;
  background: #e5e7eb;
  margin: 20px 0;
}

/* Logout */
.logout {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  padding: 12px 16px;
  font-size: 16px;
  color: #6b7280;
  cursor: pointer;
}

.logout:hover {
  background-color: #f3f4f6;
  border-radius: 8px;
}

.logout:hover span {
  color: #e63946;
}

/* MAIN */
.main {
  margin-left: 260px;
  padding: 30px;
  width: calc(100% - 260px);
}

.subtitle {
  color: #777;
  font-size: 14px;
}

/* CONSULTAS */
.consultas-container {
  margin-top: 20px;
}

.consultas-list {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
}

.consulta {
  display: flex;
  align-items: center;
  background: #f8f9ff;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 12px;
  gap: 12px;
}

.circle {
  width: 36px;
  height: 36px;
  background: #d9e4f8;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info span {
  color: #666;
  font-size: 13px;
}

.time {
  margin-left: auto;
  margin-right: 10px;
  color: #333;
}

.finalizada {
  color: #2ecc71;
  background: #d9f7e8;
  padding: 4px 8px;
  border-radius: 6px;
}

.andamento {
  color: #0a73ff;
  background: #dbe9ff;
  padding: 4px 8px;
  border-radius: 6px;
}
</style>