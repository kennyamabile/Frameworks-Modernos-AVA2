require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const db = require('./src/models');
const tasksRoutes = require('./src/routes/tasks');
const errorHandler = require('./src/middleware/errorHandler');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API do Gerenciador de Tarefas está rodando.' });
});

app.use('/api/tarefas', tasksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// middleware de erro (sempre depois das rotas)
app.use(errorHandler);

db.sequelize.sync()
  .then(() => {
    console.log('Base de dados sincronizada com sucesso.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao sincronizar a base de dados:', err);
  });
