const jwt = require('jsonwebtoken')
const students = require('../models/studentModel')
const admins = require('../models/adminModel')
const tutors = require('../models/tutorModel')

module.exports.verifyStudent = (req,res,next) =>{
  
 
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token,process.env.SECRET,async (err,decodedToken)=>{
    if(err){
      console.log(err);
      res.json({status:false,message:"Error in verification"})
    }else{
      const student = await students.findById({_id:decodedToken._id})
       
      if(student.blocked){
        res.json({ status: false,message:"You are blocked by the admin" })
      }else{
        req.user = student._id
      
        next()
      }
    }
  })
}


module.exports.verifyAdmin = (req,res,next) =>{
   
  const token = req.headers.authorization.split(' ')[1];
   
  
  jwt.verify(token,process.env.SECRET,async (err,decodedToken)=>{
    if(err){
      console.log(err);
      res.json({ status: false, message: "Error in verification" })
    }else{
      const admin = await admins.findById({_id:decodedToken._id})
      
      if(admin){
        next()
      }
    }
  })
}


module.exports.verifyTutor = (req,res,next) =>{
  
  const token = req.headers.authorization.split(' ')[1];
  
   
  jwt.verify(token,process.env.SECRET,async (err,decodedToken)=>{
    if(err){
      console.log(err);
      res.json({ status: false, message: "Error in verification" })
    }else{
      const tutor = await tutors.findById({_id:decodedToken._id})
    
      if(tutor.blocked){
        res.json({ status: false, message: "You are blocked by the admin" })
      }else{
        req.user = tutor._id
        next()
      }
    }
  })
}