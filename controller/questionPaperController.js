const questionPapers = require('../models/questionPaperModel')
const students = require('../models/studentModel')
const fs = require('fs')
const path = require('path')



module.exports.questionPaperUpload = async(req,res,next) =>{
  try {
     
    const user = req.user
   
    const filePath = req.file.path.replace("public", "");
 
    const questionPaper = new questionPapers({
      board: req.body.board,
      branch: req.body.branch,
      subject: req.body.subject,
      exam_name: req.body.examName,
      file_path: filePath,
      exclusive:req.body.exclusive,
      uploadedBy: user,
    });

    await questionPaper.save();
    
    res.json({ message: "Question Paper uploaded successfully", uploaded: true });


  } catch (error) {
console.log(error);
res.status(500).json({ message: "Something gone wrong", uploaded: false });
  }
}

module.exports.getQuestionPapers = async(req,res,next) =>{
  try {
     const {id} = req.query
    const { studentId } = req.query
    let user = req.user
     if(id){
      
      const questions = await questionPapers.find({uploadedBy:{$in:[user]}}).populate('branch','name').populate('subject','name')
       
      res.json(questions);
     }
     else if (studentId) {
       const student = await students.findById(user)
       if (student.subscription) {
         const isActive = Date.now() < new Date(student.subscription.expiredAt);
         if (isActive) {
           const questions = await questionPapers.find({ listed: true, private: false }).populate('branch', 'name').populate('subject', 'name')
           res.json(questions);
         } else {
           const questions = await questionPapers.find({ listed: true, private: false, exclusive: false }).populate('branch', 'name').populate('subject', 'name')
           res.json(questions);
         }
       } else {
         const questions = await notes.find({ listed: true, private: false, exclusive: false }).populate('branch', 'name').populate('subject', 'name')
         res.json(questions);
       }
     }
     else{
       const questions = await questionPapers.find({listed:true,private:false}).populate('branch','name').populate('subject','name')
      res.json(questions);
     }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.adminAllQuestionPapers = async(req,res,next) =>{
  try {

    if(req.query.id){
      const {id} = req.query
      const questions = await questionPapers.findOne({_id:id}).populate('branch','name').populate('subject','name').populate('board','name')
      res.json(questions)
    }else{
      const questions = await questionPapers.find({rejected:false}).populate('branch','name').populate('subject','name').populate('board','name')
    
    res.json(questions);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports.adminApproveQuestionPaper = async(req,res,next) =>{
  try {
     
    const {question} = req.query
   await questionPapers.updateOne({_id:question},{$set:{approved:true,listed:true}})
   res.json({ message: "Question Paper approved successfully", approved: true });
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", approved: false });
  }
}

module.exports.adminRejectQuestionPaper = async (req, res, next) => {
  try {

    const { question } = req.query
     
    await questionPapers.updateOne({ _id: question }, { $set: { rejected: true, rejection_reason: req.body.rejectionReason } })
    res.json({ message: "Question Paper rejected successfully", rejected: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", rejected: false });
  }
}

module.exports.adminQuestionPaperListOrUnList = async(req,res,next) =>{
  try {
    const {question} = req.query
    const QuestionToListOrUnList = await questionPapers.findById(question)
    if(QuestionToListOrUnList.listed){
      
      await questionPapers.updateOne({_id:question},{$set:{listed:false}})
      res.json({message:'Question Paper is successfully unlisted',success:true})
    }else{
      await questionPapers.updateOne({_id:question},{$set:{listed:true}})
      res.json({message:'Question Paper is successfully listed',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}


module.exports.updateQuestionPaper = async(req,res,next) =>{
  try {
    
    const {question} = req.query

    let updatedData = {
      board:req.body.board,
      branch:req.body.branch,
      subject:req.body.subject,
      exam_name:req.body.examName
    }

    if(req.file) {
      updatedData.file_path = req.file.path.replace("public", "");
    }

    let updatedQuestion  = await questionPapers.findByIdAndUpdate({_id:question},updatedData)

    if(updatedQuestion){
      res.json({ message: "Question Paper is updated successfully", updated: true });
    }else{
res.status(500).json({ message: "Error while updating", updated: false });
    }
     
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}


module.exports.privatePublicQuestions = async(req,res,next) =>{
  try {
    const {id} = req.query
     
    const questionToUpdate = await questionPapers.findById(id)
    if(questionToUpdate.private){
      
      await questionPapers.updateOne({_id:id},{$set:{private:false}})
      res.json({message:'Question Paper is successfully made public',success:true})
    }else{
      await questionPapers.updateOne({_id:id},{$set:{private:true}})
      res.json({message:'Question Paper is successfully made private',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}


module.exports.deleteQuestionPaper = async(req,res) => {
  try {
    const {id} = req.query

    const questionPaper = await questionPapers.findById(id)
    if(!questionPaper){
      return res.status(404).json({message:"Question paper not found"})
    }

    const filePath = path.join(__dirname,"../public",questionPaper.file_path)
    // fs.unlinkSync(filePath)
    await fs.promises.unlink(filePath)

    await questionPapers.deleteOne({_id:id})
    res.json({message:"Question paper removed successfully"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", success: false });
  }
}