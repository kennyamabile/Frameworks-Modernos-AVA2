/**
 * @swagger
 * tags:
 *   - name: Tarefas
 *     description: Endpoints para gerenciamento de tarefas
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: ID da tarefa
 *           example: 1
 *         title:
 *           type: string
 *           description: Título da tarefa
 *           example: "Estudar Vue.js"
 *         description:
 *           type: string
 *           description: Descrição detalhada da tarefa
 *           example: "Rever componentes, Pinia e Vue Router"
 *         done:
 *           type: boolean
 *           description: Indica se a tarefa foi concluída
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do registro
 */

/**
 * @swagger
 * /api/tarefas:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: Lista de tarefas cadastradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/tarefas/{id}:
 *   get:
 *     summary: Busca uma tarefa pelo ID
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Tarefa não encontrada
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Tarefa não encontrada
 *   delete:
 *     summary: Exclui uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       204:
 *         description: Tarefa excluída com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Tarefa não encontrada
 */

const express = require('express');
const router = express.Router();
const { Task } = require('../models');

// CREATE - POST /api/tarefas
router.post('/', async (req, res, next) => {
  try {
    const { title, description, done } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Título é obrigatório.' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      done: !!done
    });

    return res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// READ (lista) - GET /api/tarefas
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// READ por ID - GET /api/tarefas/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    return res.json(task);
  } catch (err) {
    next(err);
  }
});

// UPDATE - PUT /api/tarefas/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const { title, description, done } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Título é obrigatório.' });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    task.title = title;
    task.description = description || '';
    task.done = !!done;

    await task.save();

    return res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE - DELETE /api/tarefas/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    await task.destroy();

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
