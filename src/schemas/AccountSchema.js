const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BaseSchema = require('./_BaseSchema')

const AccountSchema = new Schema({
  ...BaseSchema,
  username: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
}, {
  collection: 'accounts',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false
})

module.exports = mongoose.model('Account', AccountSchema)
