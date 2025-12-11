# MedicareClinic 🏥

O MedicareClinic é um sistema de gestão para clínicas médicas, permitindo:

Cadastro e gerenciamento de pacientes 👩‍⚕️

Agendamento de consultas 📅

Controle de médicos e especialidades 🩺

Painel administrativo para acompanhar atendimentos 📊

Este projeto possui frontend em Vue 3 + Vite e backend em Node.js/Express.

🚀 Tecnologias Utilizadas
Frontend: Vue 3, Vite, Axios

Backend: Node.js, Express, SQLite

ESLint para padronização de código

📂 Estrutura do Projeto

MedicareClinic/
├── src/              # Código do frontend (Vue)
├── server/           # Código do backend (Node/Express)
├── public/           # Arquivos estáticos
├── index.html        # Entrada do frontend
├── vite.config.js    # Configuração do Vite
├── package.json      # Dependências e scripts
└── .env.example      # Exemplo de variáveis de ambiente


⚙️ Pré-requisitos
Antes de rodar, instale:

Node.js (versão 18+)

npm ou yarn

Banco de dados SQLite (já integrado) ou MySQL (se configurado no backend)

📥 Instalação
Clone o repositório e instale as dependências:

bash
# Clonar o repositório
git clone https://github.com/thigadasilva/MedicareClinic.git

# Entrar na pasta
cd MedicareClinic

# Instalar dependências
npm install

## ▶️ Executando o Projeto
1. Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto baseado no .env.example. Exemplo:

env
PORT=sua_porta
DB_PATH=seu_database
JWT_SECRET=senha_super_secreta

2. Rodar o Backend
Abra o terminal prompt de comando no Visual Studio Code
Insira node server/app.js
O backend será iniciado em http://localhost:3000

4. Rodar o Frontend
Em outro terminal:

Abra o terminal prompt de comando no Visual Studio Code
Insira npm run dev
O frontend será iniciado em http://localhost:5173

🔑 Funcionalidades Disponíveis
Cadastro de pacientes: formulário para inserir dados pessoais

Agendamento de consultas: escolha de médico, especialidade e horário

Listagem de médicos: painel administrativo para gerenciar profissionais

Dashboard: visão geral dos atendimentos e estatísticas
