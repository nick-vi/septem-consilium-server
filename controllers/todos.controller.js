const {
  getTodosService,
  getTodoService,
  createTodoService,
  updateTodoService,
  deleteTodoService,
  purgeTodosService,
  createInitialTodosService
} = require('../services/todos.service')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

module.exports.getTodosController = async (req, res) => {
  try {
    const { distanceFromThisWeek, userId, init } = req.query
    const todos = await getTodosService(distanceFromThisWeek, userId, init)
    res.send(todos)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.purgeTodosController = async (req, res) => {
  const response = await purgeTodosService()
  res.send(response)
}

module.exports.getTodoController = async (req, res) => {
  try {
    const { id } = req.params
    const todo = await getTodoService(id)
    res.send(todo)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.createTodoController = async (req, res) => {
  try {
    const createdTodo = await createTodoService(req.body)
    res.send(createdTodo)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.createInitialTodosController = async (req, res) => {
  try {
    const createdTodo = await createInitialTodosService(req.body, req.user.sub)
    res.send(createdTodo)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.updateTodoController = async (req, res) => {
  try {
    const { id } = req.params
    const updatedTodo = await updateTodoService(id, req.body)
    res.send(updatedTodo)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.deleteTodoController = async (req, res) => {
  try {
    const { id } = req.params
    const deletedTodo = await deleteTodoService(id)
    res.send(deletedTodo)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}
