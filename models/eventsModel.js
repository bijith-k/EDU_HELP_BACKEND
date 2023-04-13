const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  organizer:{
    type:String,
    required:true
  },
  location:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  startingDate:{
    type:Date,
    required:true
  },
  endingDate:{
    type:Date,
    required:true
  },
  link:{
    type:String,
    required:true
  },
  contact:{
    type:String,
    required:true
  },
  poster:{
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
  uploadedBy:[
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


module.exports = mongoose.model('events',eventSchema)