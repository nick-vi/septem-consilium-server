const express = require('express')
const router = express.Router()
const {
  authenticateUserController
} = require('../controllers/auth.controller')

router.post('/', authenticateUserController)

module.exports = router
