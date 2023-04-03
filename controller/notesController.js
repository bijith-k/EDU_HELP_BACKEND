const notes = require('../models/notesModel')


module.exports.notesUpload = async(req,res,next) =>{
  try {
    console.log("innnnn");

    console.log(req.body,"body");
    const user = req.user
    console.log(user);
    console.log(req.file);
    const filePath = req.file.path.replace("public", "");

console.log(req.body);
    const note = new notes({
      board: req.body.board,
      branch: req.body.branch,
      subject: req.body.subject,
      note_name: req.body.noteName,
      file_path: filePath,
      uploadedBy: user,
    });

    await note.save();
    
    res.json({ messge: "Note uploaded successfully", uploaded: true });


  } catch (error) {
console.log(error);
res.status(500).json({ messge: "Something gone wrong", uploaded: false });
  }
}


module.exports.getNotes = async(req,res,next) =>{
  try {
     
    const note = await notes.find({listed:true}).populate('branch','name').populate('subject','name')
    console.log(note);
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.adminAllNotes = async(req,res,next) =>{
  try {
     
    const note = await notes.find().populate('branch','name').populate('subject','name').populate('board','name')
    console.log(note);
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.adminApproveNotes = async(req,res,next) =>{
  try {
    console.log('in approve');
    const {note} = req.query
   await notes.updateOne({_id:note},{$set:{approved:true,listed:true}})
   res.json({ message: "Note is approved successfully", approved: true });
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", approved: false });
  }
}

module.exports.adminNoteListOrUnList = async(req,res,next) =>{
  try {
    const {note} = req.query
    const noteToUpdate = await notes.findById(note)
    if(noteToUpdate.listed){
      console.log("in");
      await notes.updateOne({_id:note},{$set:{listed:false}})
      res.json({message:'Note is successfully unlisted',success:true})
    }else{
      await notes.updateOne({_id:note},{$set:{listed:true}})
      res.json({message:'Note is successfully listed',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}