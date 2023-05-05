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
  subscription: {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'plans',
    },
    startedAt: {
      type: Date,
    },
    expiredAt: {
      type: Date,
      
    }
  },
  school:{
    type:String,
    required:true
  },
  blocked:{
    type:Boolean,
    default:'false'
  },
  password:{
    type:String,
    required:true
  },
  profilePicture: {
    type: String
  },
  created:{
    type:Date,
    required:true,
    default:Date.now
  }
})


studentSchema.virtual('subscription.isActive').get(function(){
  return Date.now() < this.subscription.expiredAt;
})

studentSchema.pre("save",async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password,salt)
  next()
})



module.exports = mongoose.model('students',studentSchema)