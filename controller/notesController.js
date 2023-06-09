const notes = require('../models/notesModel')
const students = require('../models/studentModel')
const fs = require('fs')
const path = require('path')



module.exports.notesUpload = async (req, res, next) => {
  try {

    const user = req.user

    const filePath = req.file.path.replace("public", "");


    const note = new notes({
      board: req.body.board,
      branch: req.body.branch,
      subject: req.body.subject,
      note_name: req.body.noteName,
      file_path: filePath,
      exclusive: req.body.exclusive,
      uploadedBy: user,
    });

    await note.save();

    res.json({ message: "Note uploaded successfully", uploaded: true });


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", uploaded: false });
  }
}


module.exports.getNotes = async (req, res, next) => {
  try {

    const { id } = req.query
    const { studentId } = req.query
    let user = req.user

    if (id) {

      const note = await notes.find({ uploadedBy: { $in: [user] } }).populate('branch', 'name').populate('subject', 'name')
      res.json(note);
    } else if (studentId) {
      const student = await students.findById(user)
      if (student.subscription) {
        const isActive = Date.now() < new Date(student.subscription.expiredAt);
        if (isActive) {
          const note = await notes.find({ listed: true, private: false }).populate('branch', 'name').populate('subject', 'name')
          res.json(note);
        } else {
          const note = await notes.find({ listed: true, private: false, exclusive: false }).populate('branch', 'name').populate('subject', 'name')
          res.json(note);
        }
      } else {
        const note = await notes.find({ listed: true, private: false, exclusive: false }).populate('branch', 'name').populate('subject', 'name')
        res.json(note);
      }
    }
    else {
      const note = await notes.find({ listed: true, private: false }).populate('branch', 'name').populate('subject', 'name')
      res.json(note);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.adminAllNotes = async (req, res, next) => {
  try {
    if (req.query.id) {

      const { id } = req.query

      const note = await notes.findOne({ _id: id }).populate('branch', 'name').populate('subject', 'name').populate('board', 'name')

      res.json(note);
    } else {
      const note = await notes.find({ rejected: false }).populate('branch', 'name').populate('subject', 'name').populate('board', 'name')

      res.json(note);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.adminApproveNotes = async (req, res, next) => {
  try {

    const { note } = req.query
    await notes.updateOne({ _id: note }, { $set: { approved: true, listed: true } })
    res.json({ message: "Note is approved successfully", approved: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", approved: false });
  }
}

module.exports.adminRejectNotes = async (req, res, next) => {
  try {

    const { note } = req.query

    await notes.updateOne({ _id: note }, { $set: { rejected: true, rejection_reason: req.body.rejectionReason } })
    res.json({ message: "Note is rejected successfully", rejected: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", rejected: false });
  }
}

module.exports.adminNoteListOrUnList = async (req, res, next) => {
  try {
    const { note } = req.query
    const noteToUpdate = await notes.findById(note)
    if (noteToUpdate.listed) {

      await notes.updateOne({ _id: note }, { $set: { listed: false } })
      res.json({ message: 'Note is successfully unlisted', success: true })
    } else {
      await notes.updateOne({ _id: note }, { $set: { listed: true } })
      res.json({ message: 'Note is successfully listed', success: true })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", success: false });
  }
}


module.exports.updateNotes = async (req, res, next) => {
  try {

    const { note } = req.query



    let updatedData = {
      board: req.body.board,
      branch: req.body.branch,
      subject: req.body.subject,
      note_name: req.body.noteName
    }

    if (req.file) {
      updatedData.file_path = req.file.path.replace("public", "");
    }

    let updatedNote = await notes.findByIdAndUpdate({ _id: note }, updatedData)

    if (updatedNote) {
      res.json({ message: "Note is updated successfully", updated: true });
    } else {
      res.status(500).json({ message: "Error while updating", updated: false });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}


module.exports.privatePublicNotes = async (req, res, next) => {
  try {
    const { id } = req.query

    const noteToUpdate = await notes.findById(id)
    if (noteToUpdate.private) {

      await notes.updateOne({ _id: id }, { $set: { private: false } })
      res.json({ message: 'Note is successfully made public', success: true })
    } else {
      await notes.updateOne({ _id: id }, { $set: { private: true } })
      res.json({ message: 'Note is successfully made private', success: true })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", success: false });
  }
}



module.exports.deleteNotes = async (req, res) => {
  try {
    const { id } = req.query

    const note = await notes.findById(id)
    console.log(note)
    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    const filePath = path.join(__dirname, "../public", note.file_path)
    // fs.unlinkSync(filePath)
    // await fs.promises.unlink(filePath)

    await notes.deleteOne({ _id: id })
    res.json({ message: "Note removed successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", success: false });
  }
}



