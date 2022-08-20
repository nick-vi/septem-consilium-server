const express = require('express')
const todos = require('../routes/todos.route')
const users = require('../routes/users.route')
const auth = require('../routes/auth.route')

module.exports = (app) => {
  app.use(express.json())
  app.use('/todos', todos)
  app.use('/users', users)
  app.use('/auth', auth)
}
