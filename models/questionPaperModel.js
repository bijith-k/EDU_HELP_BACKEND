const mongoose = require('mongoose')

const questionPaperSchema = new mongoose.Schema({
  board:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'board',
    required:true,
  },
  branch:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'branch',
    required:true,
  },
  subject:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subject',
    required:true
  },
  exam_name:{
    type:String,
    required:true
  },
  file_path:{
    type:String,
    required:true
  },
  approved:{
    type:Boolean,
    default:'false'
  },
  listed:{
    type:Boolean,
    default:'false'
  },
  private:{
    type:Boolean,
    default:'false'
  },
  uploadedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'students'
    },
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tutors'
    }
  ]
})

module.exports = mongoose.model('question_papers',questionPaperSchema)