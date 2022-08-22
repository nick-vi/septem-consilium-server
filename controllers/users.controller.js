const {
  getUsersService,
  getUserService,
  createUserService,
  updateUserService,
  deleteUserService,
  getUserByTokenService
} = require('../services/users.service')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

module.exports.getUsersController = async (req, res) => {
  try {
    const { distanceFromThisWeek, init } = req.query
    const users = await getUsersService(distanceFromThisWeek, init)
    res.send(users)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.getUserController = async (req, res) => {
  try {
    const { id } = req.params
    const { token } = req.query
    const user = await getUserService(id, token)
    res.send(user)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.getUserByTokenController = async (req, res) => {
  try {
    console.log('test')
    const { token } = req.params
    const user = await getUserByTokenService(token)
    res.send(user)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.createUserController = async (req, res) => {
  try {
    const { header, user } = await createUserService(req.body)
    res.header(...header).send(user)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.updateUserController = async (req, res) => {
  try {
    const { id } = req.params
    const updatedUser = await updateUserService(id, req.body)
    res.send(updatedUser)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}

module.exports.deleteUserController = async (req, res) => {
  try {
    const { id } = req.params
    const { password } = req.body
    const deletedUser = await deleteUserService(id, password)
    res.send(deletedUser)
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}
