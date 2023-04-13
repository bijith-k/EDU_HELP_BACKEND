const questionPapers = require('../models/questionPaperModel')
// const { ObjectId } = require('mongodb')



module.exports.questionPaperUpload = async(req,res,next) =>{
  try {
    console.log("innnnn");

    console.log(req.body,"body");
    const user = req.user
    console.log(user);
    console.log(req.file);
    const filePath = req.file.path.replace("public", "");

console.log(req.body);
    const questionPaper = new questionPapers({
      board: req.body.board,
      branch: req.body.branch,
      subject: req.body.subject,
      exam_name: req.body.examName,
      file_path: filePath,
      uploadedBy: user,
    });

    await questionPaper.save();
    
    res.json({ messge: "Question Paper uploaded successfully", uploaded: true });


  } catch (error) {
console.log(error);
res.status(500).json({ messge: "Something gone wrong", uploaded: false });
  }
}

module.exports.getQuestionPapers = async(req,res,next) =>{
  try {
     const {id} = req.query
     console.log(id,'qid');
     if(id){
      const questions = await questionPapers.find({uploadedBy:{$in:[id]}}).populate('branch','name').populate('subject','name')
      console.log(questions,'ooooooooooooooooooooooooooooooo');
      res.json(questions);
     }else{
      const questions = await questionPapers.find({listed:true}).populate('branch','name').populate('subject','name')
      console.log(questions,"heeeeeeeeeeee");
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
      const questions = await questionPapers.find().populate('branch','name').populate('subject','name').populate('board','name')
    console.log(questions);
    res.json(questions);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports.adminApproveQuestionPaper = async(req,res,next) =>{
  try {
    console.log('in approve');
    const {question} = req.query
   await questionPapers.updateOne({_id:question},{$set:{approved:true,listed:true}})
   res.json({ message: "Question Paper approved successfully", approved: true });
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", approved: false });
  }
}

module.exports.adminQuestionPaperListOrUnList = async(req,res,next) =>{
  try {
    const {question} = req.query
    const QuestionToListOrUnList = await questionPapers.findById(question)
    if(QuestionToListOrUnList.listed){
      console.log("in");
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
    console.log(req.body);
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
    console.log('innnnnnnnnnnnnnnnn');
    const questionToUpdate = await questionPapers.findById(id)
    if(questionToUpdate.private){
      console.log("in");
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