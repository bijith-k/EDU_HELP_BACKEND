const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
 name:{
  type:String,
  required:true,
  lowercase: true
 },
 branch:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'branch',
  required:true
 },
 listed:{
  type:Boolean,
  default:true
}
})


module.exports = mongoose.model('subject',subjectSchema)