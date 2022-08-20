const mongoose = require('mongoose')
const Joi = require('joi')

const TodoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, minlength: 1, maxlength: 55, required: true },
  isComplete: { type: Boolean, default: false },
  dueDate: { type: Date },
  column: { type: Number },
  bgColor: { type: Number, default: 0 }
}, { timestamps: true })

TodoSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v
    ret.id = ret._id.toString()
    delete ret._id
  }
})

module.exports.Todo = mongoose.model('Todo', TodoSchema)

module.exports.validateTodo = (todo) => {
  const schema = Joi.object({
    userId: Joi.custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message('Invalid user id')
      }
      return true
    }).required(),
    text: Joi.string().min(1).max(55),
    isComplete: Joi.boolean(),
    dueDate: Joi.string().isoDate(),
    column: Joi.number().greater(-1).less(3),
    bgColor: Joi.number().greater(-1).less(6)
  })

  return schema.validate(todo)
}
