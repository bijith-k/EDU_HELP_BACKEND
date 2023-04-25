const tutors = require('../models/tutorModel')
const bcrypt = require("bcrypt");


module.exports.adminAllTutors = async(req,res,next) => {
  try {
    const tutor = await tutors.find({rejected:false}).populate('branch', 'name').populate('board', 'name')
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


module.exports.updateProfile = async (req, res) => {
  try {
    
    const { id } = req.query


    let updatedData = {
      board: req.body.board,
      branch: req.body.branch,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subjects: req.body.subjects,
      timeFrom:req.body.timeFrom,
      timeTo:req.body.timeTo,
      place:req.body.place,
      profession:req.body.profession
    }

    if (req.file) {
      updatedData.profilePicture = req.file.path.replace("public", "");
    }

    let updatedProfile = await tutors.findByIdAndUpdate({ _id: id }, updatedData)
    let tutor = await tutors.findById(id).populate('branch', 'name').populate('board', 'name')
    if (updatedProfile) {
      res.json({ message: "Profile is updated successfully", tutor, updated: true });
    } else {
      res.status(500).json({ message: "Error while updating", updated: false });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}


module.exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const { id } = req.query

    const tutor = await tutors.findById(id)
    const auth = await bcrypt.compare(currentPassword, tutor.password)
    if (auth) {
      tutor.password = newPassword
      tutor.save()
      return res.status(200).json({ message: 'Password changed successfully', updated: true })
    } else {
      return res.status(200).json({ message: 'Entered password is incorrect', updated: false })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}


module.exports.adminApproveTutor = async (req, res, next) => {
  try {
    const { tutor } = req.query
     
    await tutors.updateOne({_id:tutor},{$set:{approved:true}})
    res.json({ message: 'Tutor is successfully approved', approved: true })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", approved: false });
  }
}

module.exports.adminRejectTutor = async (req, res, next) => {
  try {
    const { tutor } = req.query
     
    
    await tutors.updateOne({ _id: tutor }, { $set: { rejected: true, rejection_reason:req.body.rejectionReason } })
    res.json({ message: 'Tutor is rejected successfully', rejected: true })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", rejected: false });
  }
}