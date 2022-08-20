const { User } = require('../models/user.model')
const bcrypt = require('bcrypt')
const { ServerError } = require('../utils')
const Joi = require('joi')
const { pick } = require('../utils/data')
const mongoose = require('mongoose')

const validateUser = (user) => {
  const schema = Joi.object({
    password: Joi.string().min(8).max(255).required(),
    email: Joi.string().email().min(8).max(255).required()
  })

  return schema.validate(user)
}

exports.authenticateUserService = async (payload) => {
  const { email, password } = payload
  const { error } = validateUser({ email, password })
  if (error) throw new ServerError(error.details[0].message, 400)

  const invalidAuthMessage = 'Invalid email or password'

  let user = await User.findOne().where('email').equals(email)

  if (!user) throw new ServerError(invalidAuthMessage, 400)

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) throw new ServerError(invalidAuthMessage, 400)

  const token = user.generateAuthToken()

  user = pick(user._doc, ['name', 'email'])

  const result = {
    headers: ['Authorization', `Bearer ${token}`],
    user,
    token
  }

  return result
}
