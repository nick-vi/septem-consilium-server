const {
  authenticateUserService
} = require('../services/auth.service')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

module.exports.authenticateUserController = async (req, res) => {
  try {
    const { headers, user, token } = await authenticateUserService(req.body)
    res.header(...headers).send({ ...user, token })
  } catch (err) {
    res.status(err.httpStatus).send(err.error)
  }
}
