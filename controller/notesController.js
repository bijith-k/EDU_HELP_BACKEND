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
     
    const note = await notes.find({listed:false}).populate('branch','name').populate('subject','name')
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