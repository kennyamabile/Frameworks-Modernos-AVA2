const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Tarefas',
      version: '1.0.0',
      description: 'Documentação da API REST do Gerenciador de Tarefas (Express + Sequelize + MySQL)',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor local de desenvolvimento',
      },
    ],
  },
  // Caminhos dos arquivos onde estão os comentários JSDoc com as definições da API
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
