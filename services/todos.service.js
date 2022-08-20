const { Todo, validateTodo } = require('../models/todo.model')
const { ServerError } = require('../utils')
const mongoose = require('mongoose')
const { getWeekStartAndEnd } = require('../utils/date')

exports.getTodosService = async (distanceFromThisWeek, userId, init = false) => {
  if (distanceFromThisWeek && !isNaN(parseInt(distanceFromThisWeek))) {
    const { start, end } = getWeekStartAndEnd(distanceFromThisWeek)

    const requestedWeekTodos = {
      dueDate: {
        $gte: start,
        $lte: end
      }
    }

    let queryObj
    init
      // fetch both requested todos and drafts on init
      ? queryObj = { $or: [{ ...requestedWeekTodos }, { dueDate: undefined }] }
      : queryObj = requestedWeekTodos

    queryObj.userId = userId
    return await Todo.find(queryObj)
      .select({ __v: 0, _id: 1 })
  }
}

exports.purgeTodosService = async () => {
  const response = await Todo.deleteMany({})
  return response
}

exports.getTodoService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ServerError('Invalid ObjectId', 400)
  const todo = await Todo.findById(id)
  if (!todo) throw new ServerError('Todo was not found', 404)
  return todo
}

exports.createTodoService = async (payload) => {
  const { text, dueDate, column, userId } = payload
  const { error } = validateTodo({ text, dueDate, column, userId })
  if (error) throw new ServerError(error.details[0].message, 400)
  const _payload = { userId, text }
  dueDate ? _payload.dueDate = dueDate : _payload.column = column
  const todo = await Todo.create(_payload)
  return todo
}

exports.createInitialTodosService = async (payload, userId) => {
  let todos = Todo.find({ userId })
  if (!todos) throw new ServerError('User already have todos.', 400)
  todos = []
  for (const todo of payload) {
    const {
      text,
      dueDate,
      column,
      isComplete,
      bgColor
    } = todo
    const { error } = validateTodo({ text, dueDate, column, userId, isComplete, bgColor })
    if (error) throw new ServerError(error.details[0].message, 400)
    const _todo = { userId, text, isComplete, bgColor }
    dueDate ? _todo.dueDate = dueDate : _todo.column = column
    todos.push(_todo)
  }
  const insertedTodos = await Todo.insertMany(todos)
  return insertedTodos
}

exports.updateTodoService = async (id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ServerError('Invalid ObjectId', 400)

  const { error } = validateTodo({ ...payload })
  if (error) throw new ServerError(error.details[0].message, 400)

  const _payload = {}
  if (payload.text) _payload.text = payload.text
  if (payload.dueDate) _payload.dueDate = payload.dueDate
  if (typeof payload.column !== 'undefined') _payload.column = payload.column
  if (typeof payload.isComplete !== 'undefined') _payload.isComplete = payload.isComplete
  if (typeof payload.bgColor !== 'undefined') _payload.bgColor = payload.bgColor

  const shiftPosition = () => {
    if (_payload.dueDate && typeof _payload.column === 'undefined') {
      return { column: 1 }
    }
    if (typeof _payload.column !== 'undefined' && !_payload.dueDate) {
      return { dueDate: 1 }
    }
    return {}
  }

  const todo = await Todo.findByIdAndUpdate(
    id,
    {
      ..._payload,
      $unset: shiftPosition()
    },
    { new: true }
  )
  if (!todo) throw new ServerError('Todo was not found', 404)

  return todo
}

exports.deleteTodoService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ServerError('Invalid ObjectId', 400)
  const todo = await Todo.findByIdAndDelete(id)
  if (!todo) throw new ServerError('Todo was not found', 404)
  return todo
}
