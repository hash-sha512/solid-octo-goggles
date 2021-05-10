const mongoose = require('mongooose')

let toysDbSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true
  },
  birthday: {
    type: Date
  }
});


let electronicsDbSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number,
    required: true
  },
  birthday: {
    type: Date
  }
})


module.exports.toysDbSchema = toysDbSchema
module.exports.electronicsDbSchema = electronicsDbSchema
