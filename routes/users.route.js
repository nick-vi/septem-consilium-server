const express = require('express')
const { auth } = require('../middleware/auth')
const router = express.Router()
const {
  getUsersController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController
} = require('../controllers/users.controller')

router.get('/', getUsersController)
router.get('/:id', getUserController)
router.post('/', createUserController)
router.put('/:id', auth, updateUserController)
router.delete('/:id', deleteUserController)

module.exports = router
