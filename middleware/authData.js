const jwt = require('jsonwebtoken')
const students = require('../models/studentModel')

module.exports.verifyStudent = (req,res,next) =>{
  const token = req.body.token
  jwt.verify(token,process.env.SECRET,async (err,decodedToken)=>{
    if(err){
      res.json({status:false})
    }else{
      const student = await students.findById({_id:decodedToken._id})
      if(student){
        res.json({student,token,status:true})
      }
    }
  })
}