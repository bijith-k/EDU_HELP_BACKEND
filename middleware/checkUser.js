const jwt = require('jsonwebtoken')
const students = require('../models/studentModel')
const tutors = require('../models/tutorModel')

module.exports.CheckStudent = (req,res,next) =>{
  // console.log(req.body);
  // const token = req.headers.token
  // console.log(req.headers);
  
  const token = req.body.token
  
  jwt.verify(token,process.env.SECRET,async (err,decodedToken)=>{
    if(err){
      console.log(err);
      res.json({status:false})
    }else{
      const student = await students.findById({_id:decodedToken._id}).populate('branch','name').populate('board','name')
      req.user = student._id
      
      if(student){
        console.log(student);
        res.json({student,token,status:true})
        // next()
      }
    }
  })
}


module.exports.CheckTutor = (req,res,next) =>{
  // console.log(req.body);
  // const token = req.headers.token
  // console.log(req.headers);
  
  const token = req.body.token
  
  jwt.verify(token,process.env.SECRET,async (err,decodedToken)=>{
    if(err){
      console.log(err);
      res.json({status:false})
    }else{
      const tutor = await tutors.findById({_id:decodedToken._id}) 
      req.user = tutor._id
      
      if(tutor){
        console.log(('innn'));
        res.json({tutor,token,status:true})
        // next()
      }
    }
  })
}