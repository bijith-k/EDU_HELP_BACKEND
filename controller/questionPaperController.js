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
     
    const questions = await questionPapers.find({listed:false}).populate('branch','name').populate('subject','name')
    console.log(questions);
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.adminAllQuestionPapers = async(req,res,next) =>{
  try {
     
    const questions = await questionPapers.find().populate('branch','name').populate('subject','name').populate('board','name')
    console.log(questions);
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}