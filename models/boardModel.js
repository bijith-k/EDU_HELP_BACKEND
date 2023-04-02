const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    lowercase: true,
  },
  listed:{
    type:Boolean,
    default:true
  }
})

module.exports = mongoose.model('board',boardSchema)