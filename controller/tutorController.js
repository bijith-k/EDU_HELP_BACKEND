const tutors = require('../models/tutorModel')

module.exports.adminAllTutors = async(req,res,next) => {
  try {
    const tutor = await tutors.find().populate()
     console.log(tutor);
     res.json(tutor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports.adminBlockUnblockTutor = async(req,res,next) =>{
  try {
    const {tutor} = req.query
    const tutorsToUpdate = await tutors.findById(tutor)
    if(tutorsToUpdate.blocked){
      console.log("in");
      await tutors.updateOne({_id:tutor},{$set:{blocked:false}})
      res.json({message:'Tutor is successfully unblocked',success:true})
    }else{
      await tutors.updateOne({_id:tutor},{$set:{blocked:true}})
      res.json({message:'Tutor is successfully blocked',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}


module.exports.getTutors = async(req,res,next) =>{
  try {
      const {id} = req.query
      if(id){
        const tutor = await tutors.find({_id:id, blocked: false }).populate('branch', 'name').populate('board', 'name')
        // console.log(tutor,"lls");
        res.json(tutor);
      }else{
        const tutor = await tutors.find({ blocked: false }).populate('branch', 'name').populate('board', 'name')
        // console.log(tutor,"lls");
        res.json(tutor);
      }
      
    
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}