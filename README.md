# 📌 Projeto – Gerenciador de Tarefas (Vue 3 + Vuetify + Pinia + Express.js + MySQL/Supabase)

## 👥 Discentes

- Kenny Amabile da Rocha ([kenny.amabile@unemat.br](mailto:kenny.amabile@unemat.br))
- Sandy Hikaru Honda ([sandy.honda@unemat.br](mailto:sandy.honda@unemat.br))

Este projeto implementa um sistema completo com:

- Autenticação via **Google**
- Gestão de sessão com **Pinia**
- **CRUD completo** de tarefas
- **Frontend** em Vue 3 + Vuetify
- **Backend** em Express.js
- Persistência em **MySQL** ou **Supabase/PostgreSQL**

O projeto foi estruturado para atender **todos os requisitos avaliativos**, garantindo organização, documentação clara e fluxo funcional do sistema.

---

# 🚀 Tecnologias Utilizadas

### **Frontend**

- Vue 3 (Vite)
- Vuetify
- Vue Router
- Pinia
- Axios
- Firebase Auth / Supabase Auth

### **Backend**

- Node.js + Express.js
- Sequelize (MySQL) / Supabase Client
- CORS
- dotenv

---

# 🗄️ 1. Backend (API REST + MySQL ou Supabase)

## 1.1. Criando o Banco MySQL

Você pode usar o arquivo `tarefas_db.sql` ou criar manualmente:

```sql
CREATE DATABASE tarefas_db;

CREATE USER 'tarefas_user'@'localhost' IDENTIFIED BY 'senha_forte';
GRANT ALL PRIVILEGES ON tarefas_db.* TO 'tarefas_user'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(255) NOT NULL,
  `description` text,
  `done` tinyint(1) default '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=latin1;
```

## 1.2. Se necessario ajuste as conexões com o banco em \backend\.env

## 1.3. Instalando e executando o backend

cd backend
npm install
npm run dev

A API ficará disponível em:

http://localhost:3001

## 1.4. Endpoints da API REST

Método Rota Descrição
POST /api/tarefas Cria nova tarefa
GET /api/tarefas Lista todas tarefas
GET /api/tarefas/:id Obtém tarefa por ID
PUT /api/tarefas/:id Atualiza tarefa
DELETE /api/tarefas/:id Exclui tarefa

O Sequelize realiza o sync() automaticamente e cria a tabela Tasks.

# 🎨 2. Frontend (Vue 3 + Vuetify + Pinia)

## 2.1 Criando .env no frontend

cd frontend
cp .env.example .env

Autenticação Google já configurada – nenhuma edição é necessária.

## 2.2 Instalando e rodando

cd frontend
npm install
npm run dev

A aplicação abre em:

http://localhost:5173

## 2.3 Rotas

Rota Acesso Descrição
/login Público Login com Google
/dashboard Privado Visão geral do usuário
/tarefas Privado CRUD completo

Somente usuários autenticados podem acessar rotas internas.
O estado de sessão é salvo no Pinia + localStorage.

# 🔐 3. Autenticação com Google + Sessão no Pinia

Login via Firebase Auth / Supabase Auth

Sessão persistida no Pinia

Logout limpa estado global e encerra sessão

Rotas protegidas com navigation guards

Exemplo de guard:
router.beforeEach((to, from, next) => {
const auth = useAuthStore();

if (to.meta.requiresAuth && !auth.isLogged) {
next('/login');
} else {
next();
}
});

# 🔗 4. Integração Frontend + Backend

O frontend usa VITE_API_BASE_URL para enviar requisições.

O backend usa CORS para permitir requisições do frontend.

CRUD de tarefas usando Axios:

axios.get(`${import.meta.env.VITE_API_BASE_URL}/tarefas`);

# ⚙️ 5. Comandos Rápidos

Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

Acessar:

http://localhost:5173/login

# 6. Acessar Swagger

 Use o endpoint Swagger em http://localhost:3001/api-docs para testar a API, se desejar.
