<template>
   <div class="container">

    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="brand">
            <div class="icon">+</div>
            <div>
                <h2>Medicare</h2>
                <span>Clínica</span>
            </div>
        </div>

        <div class="user-box">
            <div class="avatar">DC</div>
            <div>
                <p class="username">Dr. Carlos Admin</p>
                <span class="role">Recepção</span>
            </div>
        </div>

        <nav class="menu">
            <a v-if="userRole === 'admin'" href="#" class="item" @click="handleDashboard">Dashboard</a>
            <a v-if="userRole === 'admin'" href="#" class="item">Agenda</a>
            <a href="#" class="item active" @click="handleConsultas">Consultas</a>
            <a v-if="userRole === 'admin'" href="#" class="item">Pacientes</a>
            <a v-if="userRole === 'admin'" href="#" class="item">Médicos</a>
        </nav>

        <button class="logout" @click="handleLogout">
            <span class="icon">⟵</span>
            <span>Sair</span>
        </button>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main">
        <h1>Consultas</h1>
        <span class="subtitle">Atendimentos e registros médicos</span>

        <div class="search-box">
            <input type="text" placeholder="Buscar paciente..." />
        </div>

        <section class="consultas-container">

            <!-- Lista -->
            <div class="consultas-list">
                <h3 class="section-title">Consultas de Hoje</h3>

                <div class="consulta selected">
                    <div class="icon user"></div>
                    <div class="info">
                        <h4>Maria Silva</h4>
                        <span>Consulta de Rotina</span>
                    </div>
                    <div class="time">09:00</div>
                    <span class="status finalizada">Finalizada</span>
                </div>

                <div class="consulta">
                    <div class="icon user"></div>
                    <div class="info">
                        <h4>Carlos Santos</h4>
                        <span>Retorno</span>
                    </div>
                    <div class="time">10:00</div>
                    <span class="status andamento">Em Atendimento</span>
                </div>

                <div class="consulta">
                    <div class="icon user"></div>
                    <div class="info">
                        <h4>Ana Oliveira</h4>
                        <span>Primeira Consulta</span>
                    </div>
                    <div class="time">11:00</div>
                    <span class="status aguardando">Aguardando</span>
                    <button class="btn">Iniciar</button>
                </div>

                <div class="consulta">
                    <div class="icon user"></div>
                    <div class="info">
                        <h4>José Lima</h4>
                        <span>Exames</span>
                    </div>
                    <div class="time">14:30</div>
                    <span class="status aguardando">Aguardando</span>
                    <button class="btn">Iniciar</button>
                </div>

                <div class="consulta">
                    <div class="icon user"></div>
                    <div class="info">
                        <h4>Paula Costa</h4>
                        <span>Consulta de Rotina</span>
                    </div>
                    <div class="time">16:00</div>
                    <span class="status cancelada">Cancelada</span>
                </div>
            </div>

            <!-- Registro de Atendimento -->
            <div class="registro">
                <h3>Registro de Atendimento</h3>

                <div class="registro-card">
                    <h4>Maria Silva</h4>
                    <span>Consulta de Rotina</span>
                    <span>09:00</span>
                </div>

                <label>Observações do Atendimento</label>
                <textarea placeholder="Paciente em bom estado geral. Pressão: 120/80"></textarea>

                <button class="btn-success">Atendimento finalizado</button>
            </div>
       </section>
   </main>
   </div>
    <button @click="handleLogout">Logout</button>
</template>
<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    const handleLogout = () => {
      store.dispatch('auth/logout')
      router.push('/login') // redireciona para tela de login
    }

    const handleAgenda = () => {
        router.push('/agenda')
    }

    const handleDashboard = () => {
      // Usa o método push do router para navegar para a rota '/dashboard'
      router.push('/dashboard') 
    }
    return { 
      handleLogout,
      handleDashboard,
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
