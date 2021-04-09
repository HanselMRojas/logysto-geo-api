const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BaseSchema = require('./_BaseSchema')

const SessionSchema = new Schema({
  ...BaseSchema,
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  hash: {
    type: String,
    unique: true,
    required: true
  }
}, {
  collection: 'sessions',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false
})

SessionSchema.pre('save', function (next) {
  const hash = bcrypt.hashSync(this.hash, bcrypt.genSaltSync(11))
  this.hash = hash
  next()
})

module.exports = mongoose.model('Session', SessionSchema)
