const mongoose = require('mongoose')

const plansSchema = new mongoose.Schema({
  plan:{
    type:String,
    required:true
  },
  duration:{
    type:Number,
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
  used_by: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'students',
      required: true
    },
    startedAt: {
      type: Date,
      
      required: true
    },
    expiredAt: {
      type: Date,
      required: true
    }
  }]
})


module.exports = mongoose.model('plans',plansSchema)