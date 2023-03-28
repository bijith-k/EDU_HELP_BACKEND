const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const tutorSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  phone:{
    type:String,
    required:true
  },
  subjects:{
    type:Array,
    required:true
  },
  timeFrom:{
    type:String,
    required:true
  },
  timeTo:{
    type:String,
    required:true
  },
  place:{
    type:String,
    required:true
  },
  profession:{
    type:String,
    required:true
  },
  status:{
    type:String,
    default:'unblocked'
  },
  password:{
    type:String,
    required:true
  },
  created:{
    type:Date,
    required:true,
    default:Date.now
  }
})


tutorSchema.pre("save",async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password,salt)
  next()
})



module.exports = mongoose.model('tutors',tutorSchema)