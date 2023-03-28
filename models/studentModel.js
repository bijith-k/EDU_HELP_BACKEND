const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const studentSchema = new mongoose.Schema({
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
  branch:{
    type:String,
    required:true
  },
  board:{
    type:String,
    required:true
  },
  school:{
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


studentSchema.pre("save",async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password,salt)
  next()
})



module.exports = mongoose.model('students',studentSchema)