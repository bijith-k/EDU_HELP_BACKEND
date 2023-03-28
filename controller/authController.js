const students = require('../models/studentModel')
const tutors = require('../models/tutorModel')
const jwt = require('jsonwebtoken')
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt')


const createToken = (_id) =>{
  return jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'})
}

const handleError = (err) =>{
  if(err.code === 11000){
   let errors = 'Student with same email is there'
   return errors
  }
}
const handleErrorT = (err) =>{
  if(err.code === 11000){
   let errors = 'Tutor with same email is there'
   return errors
  }
}

module.exports.signup =  async (req,res,next) =>{
try {
  const {name,email,phone,branch,board,school,password,place} = req.body
  const student = await students.create({name,email,phone,branch,board,school,password,place});
 
  res.status(200).json({message:'Successfully registered',created:true})
   
} catch (error) {
  console.log(error);
  const errors = handleError(error)
  res.status(400).json({errors,created:false})
}
}

module.exports.signin = async (req,res,next) =>{
  try {
    const {email,password} = req.body
    const student = await  students.findOne({email})
    if(student){
const auth = await bcrypt.compare(password,student.password)
if(auth){
  const token = createToken(student._id)
  res.json({messge:'Login successful',created:true,token,student})
}else{
  res.json({message:'Password is incorrect',created:false})
}
    }else{
      res.json({message:'No student with the entered email',created:false})
    }
  } catch (error) {
    console.log(error);
    res.json({message:"Something gone wrong",created:false})
  }

}


module.exports.tutorSignup =  async (req,res,next) =>{
  try {
    const {name,email,phone,subjects,timeFrom,timeTo,profession,password,place} = req.body
    const tutor = await tutors.create({name,email,phone,subjects,timeFrom,timeTo,profession,password,place});
   
    res.status(200).json({message:'Successfully registered',created:true})
     
  } catch (error) {
    console.log(error);
    const errors = handleErrorT(error)
    res.status(400).json({errors,created:false})
  }
  }

  module.exports.tutorSignin = async (req,res,next) =>{
    try {
      const {email,password} = req.body
      const tutor = await  tutors.findOne({email})
      if(tutor){
  const auth = await bcrypt.compare(password,tutor.password)
  if(auth){
    const token = createToken(tutor._id)
    res.json({messge:'Login successful',created:true,token,tutor})
  }else{
    res.json({message:'Password is incorrect',created:false})
  }
      }else{
        res.json({message:'No tutor with the entered email',created:false})
      }
    } catch (error) {
      console.log(error);
      res.json({message:"Something gone wrong",created:false})
    }
  
  }