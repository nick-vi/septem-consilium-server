const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: { type: String, minlength: 1, maxlength: 28, required: true, trim: true },
  password: { type: String, minlength: 8, maxlength: 60, required: true },
  email: { type: String, minlength: 8, maxlength: 55, trim: true, unique: true, lowercase: true, required: true }
}, { timestamps: true })

UserSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

UserSchema.set('toJSON', {
  virtuals: true
})

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ sub: this._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '7d' })
}

module.exports.validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(28).required(),
    password: Joi.string().min(8).max(28).required(),
    email: Joi.string().email().min(8).max(55).required()
  })

  return schema.validate(user)
}

module.exports.validateUserUpdate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(28),
    password: Joi.string().min(8).max(28),
    email: Joi.string().email().min(8).max(55)
  })

  return schema.validate(user)
}

module.exports.User = mongoose.model('User', UserSchema)
