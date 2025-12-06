# Projeto Gerenciador de Tarefas (Vue 3 + Vuetify + Pinia + Express + MySQL)

Estrutura:

- `frontend/`: aplicação Vue 3 (Vite) com Vuetify, Vue Router, Pinia e autenticação Google (Firebase Auth)
- `backend/`: API REST em Express.js com Sequelize + MySQL
- CRUD completo de **tarefas**

## Requisitos

- Node.js >= 18
- NPM ou Yarn
- MySQL rodando localmente
- Conta Firebase (para Auth Google)

---

## 1. Backend (API REST + MySQL)

### 1.1. Configuração do banco

Crie um banco de dados MySQL, por exemplo:

```sql
CREATE DATABASE tarefas_db
```

Crie um usuário com acesso (ou use o root):

```sql
CREATE USER 'tarefas_user'@'localhost' IDENTIFIED BY 'senha_forte';
GRANT ALL PRIVILEGES ON tarefas_db.* TO 'tarefas_user'@'localhost';
FLUSH PRIVILEGES;
```

### 1.2. Configurar variáveis de ambiente

No diretório `backend/`, copie o arquivo `.env.example` para `.env`:

```bash
cd backend
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_NAME=tarefas_db
DB_USER=tarefas_user
DB_PASSWORD=senha_forte
CORS_ORIGIN=http://localhost:5173
PORT=3000
```

### 1.3. Instalar dependências e rodar

```bash
cd backend
npm install
npm run dev           # modo desenvolvimento (nodemon)
# ou
npm start             # modo produção
```

A API ficará disponível em `http://localhost:3000`.

Endpoints principais:

- `POST /api/tarefas`
- `GET /api/tarefas`
- `GET /api/tarefas/:id`
- `PUT /api/tarefas/:id`
- `DELETE /api/tarefas/:id`

O Sequelize fará o `sync()` automático e criará a tabela `Tasks`.

---

## 2. Frontend (Vue 3 + Vite + Vuetify + Pinia)

### 2.1. Configurar projeto Firebase

1. Acesse o console Firebase e crie um novo projeto.
2. Crie um **App Web** e copie as credenciais.
3. Em **Authentication > Sign-in method**, habilite o provedor **Google**.
4. Em **Configurações do projeto > Geral**, copie os dados do SDK Web.

No diretório `frontend/`, copie `.env.example` para `.env`:

```bash
cd frontend
cp .env.example .env
```

Preencha os valores com os dados do Firebase:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=SEU_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_SENDER_ID
VITE_FIREBASE_APP_ID=SEU_APP_ID
```

### 2.2. Instalar dependências e rodar

```bash
cd frontend
npm install
npm run dev
```

A aplicação ficará em `http://localhost:5173`.

Rotas:

- `/login` (pública)
- `/dashboard` (privada)
- `/tarefas` (privada, CRUD completo)

Apenas usuários autenticados via Google podem acessar as rotas privadas.  
O estado de sessão (dados básicos do usuário) é persistido no **Pinia** via `localStorage`.

---

## 3. Integração Frontend + Backend

- O frontend lê `VITE_API_BASE_URL` para chamar a API.
- O backend habilita CORS para `http://localhost:5173` (configurável em `.env`).
- O CRUD de tarefas no frontend consome os endpoints do backend via Axios.

---

## 4. Comandos rápidos

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Depois acesse `http://localhost:5173/login` no navegador.
