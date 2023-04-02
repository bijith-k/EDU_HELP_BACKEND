const jwt = require('jsonwebtoken')
const students = require('../models/studentModel')
const admins = require('../models/adminModel')

module.exports.verifyStudent = (req,res,next) =>{
  // console.log(req.body);
  const token = req.headers.authorization.split(' ')[1];
  console.log(req.headers);
  
  // const token = req.body.token
  
  jwt.verify(token,process.env.SECRET,async (err,decodedToken)=>{
    if(err){
      console.log(err);
      res.json({status:false})
    }else{
      const student = await students.findById({_id:decodedToken._id})
      req.user = student._id
      req.branch = student.branch
       
      if(student){
        console.log(('innn'));
        // res.json({student,token,status:true})
        next()
      }
    }
  })
}


module.exports.verifyAdmin = (req,res,next) =>{
  // console.log(req.body);
  const token = req.headers.authorization.split(' ')[1];
  console.log(req.headers);
  
  // const token = req.body.token
  
  jwt.verify(token,process.env.SECRET,async (err,decodedToken)=>{
    if(err){
      console.log(err);
      res.json({status:false})
    }else{
      const admin = await admins.findById({_id:decodedToken._id})
      
       
      if(admin){
        console.log(('innn'));
        // res.json({student,token,status:true})
        next()
      }
    }
  })
}