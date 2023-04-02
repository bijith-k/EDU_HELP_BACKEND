const mongoose = require('mongoose')

const branchSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    lowercase: true
  },
  board:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'board',
    required:true
  },
  listed:{
    type:Boolean,
    default:true
  }
})

module.exports = mongoose.model('branch',branchSchema)