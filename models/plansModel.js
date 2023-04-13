const mongoose = require('mongoose')

const plansSchema = new mongoose.Schema({
  plan:{
    type:String,
    required:true
  },
  duration:{
    type:String,
    required:true
  },
  price:{
    type:String,
    required:true
  },
  listed:{
    type:Boolean,
    default:'true'
  },
  used_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students'
  }
})


module.exports = mongoose.model('plans',plansSchema)