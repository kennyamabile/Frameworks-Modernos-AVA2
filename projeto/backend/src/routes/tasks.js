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
