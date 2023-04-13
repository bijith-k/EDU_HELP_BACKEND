const students = require('../models/studentModel')


module.exports.adminAllStudents = async(req,res,next) => {
  try {
    const student = await students.find().populate().populate('branch','name').populate('board','name')
     console.log(student);
     res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports.adminBlockUnblockStudent = async(req,res,next) =>{
  try {
    const {student} = req.query
    const studentsToUpdate = await students.findById(student)
    if(studentsToUpdate.blocked){
      console.log("in");
      await students.updateOne({_id:student},{$set:{blocked:false}})
      res.json({message:'Student is successfully unblocked',success:true})
    }else{
      await students.updateOne({_id:student},{$set:{blocked:true}})
      res.json({message:'Student is successfully blocked',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}