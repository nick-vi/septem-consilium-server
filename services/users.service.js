const { User, validateUser, validateUserUpdate } = require('../models/user.model')
const bcrypt = require('bcrypt')
const { ServerError } = require('../utils')
const mongoose = require('mongoose')

const saltRounds = 10

exports.getUsersService = async () => {
  return await User.find().select('-__v')
}

exports.getUserService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ServerError('Invalid ObjectId', 400)
  const user = await User.findById(id)
  if (!user) throw new ServerError('User was not found', 404)
  return user
}

exports.createUserService = async (payload) => {
  const { name, email, password } = payload
  const { error } = validateUser({ name, email, password })
  if (error) throw new ServerError(error.details[0].message, 400)

  let user = await User.findOne({ email })
  if (user) throw new ServerError('User already registered.', 400)

  user = await User.create({ name, email, password })

  const salt = await bcrypt.genSalt(saltRounds)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken()

  const result = {
    header: ['Authorization', `Bearer ${token}`],
    user: {
      name: user.name,
      email: user.email,
      token
    }
  }

  return result
}

exports.updateUserService = async (id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ServerError('Invalid ObjectId', 400)

  const { error } = validateUserUpdate({ ...payload })
  if (error) throw new ServerError(error.details[0].message, 400)
  const user = await User.findByIdAndUpdate(id, { ...payload }, { new: true })
  if (!user) throw new ServerError('User was not found', 404)

  return user
}

exports.deleteUserService = async (id, password) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ServerError('Invalid ObjectId', 400)

  const user = await User.findById(id)

  if (!user) throw new ServerError('User was not found', 404)

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) throw new ServerError('Oops, that\'s thats not your password.', 400)

  await user.remove()

  return user
}
