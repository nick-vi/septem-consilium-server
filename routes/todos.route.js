const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const {
  getTodosController,
  getTodoController,
  createTodoController,
  updateTodoController,
  deleteTodoController,
  purgeTodosController,
  createInitialTodosController
} = require('../controllers/todos.controller')

router.get('/', auth, getTodosController)
router.post('/multiple', auth, createInitialTodosController)
router.post('/purge', purgeTodosController)
router.get('/:id', getTodoController)
router.post('/', auth, createTodoController)
router.put('/:id', updateTodoController)
router.delete('/:id', auth, deleteTodoController)

module.exports = router
