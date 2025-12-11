## MedicareClinic 🏥
O MedicareClinic é um sistema de gestão para clínicas médicas, permitindo:

Cadastro e gerenciamento de pacientes 👩‍⚕️

Agendamento de consultas 📅

Controle de médicos e especialidades 🩺

Painel administrativo para acompanhar atendimentos 📊

Este projeto possui frontend em Vue 3 + Vite e backend em Node.js/Express.

🚀 Tecnologias Utilizadas
Frontend: Vue 3, Vite, Axios

Backend: Node.js, Express, SQLite/MySQL (dependendo da configuração)

ESLint para padronização de código

📂 Estrutura do Projeto
Código
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
▶️ Executando o Projeto
1. Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto baseado no .env.example. Exemplo:

env
# Backend
PORT=3000
DB_URL=sqlite://./server/database.sqlite

# Frontend
VITE_API_URL=http://localhost:3000
2. Rodar o Backend
bash
cd server
npm install
npm run dev
O backend será iniciado em http://localhost:3000

3. Rodar o Frontend
Em outro terminal:

bash
npm run dev
O frontend será iniciado em http://localhost:5173

🧪 Scripts Disponíveis
npm run dev → inicia frontend em modo desenvolvimento

npm run lint → verifica problemas de estilo

npm run dev (no server/) → inicia backend em modo desenvolvimento

🔑 Funcionalidades Disponíveis
Cadastro de pacientes: formulário para inserir dados pessoais

Agendamento de consultas: escolha de médico, especialidade e horário

Listagem de médicos: painel administrativo para gerenciar profissionais

Dashboard: visão geral dos atendimentos e estatísticas
