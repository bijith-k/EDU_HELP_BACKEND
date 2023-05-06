const favourites = require('../models/FavouritesModel')
const notes = require('../models/notesModel')
const questions = require('../models/questionPaperModel')
const videos = require('../models/videosModel')
const students = require('../models/studentModel')


module.exports.addFavouriteNote = async(req,res,next) =>{
try {
  let noteId = req.params.id
  let studentId = req.user

  let favouriteNote = await notes.findOne({ _id: noteId }).populate('branch', 'name').populate('subject', 'name')

  let noteObj = {
    note:noteId,
    branch:favouriteNote.branch.name,
    subject:favouriteNote.subject.name
  }

  let studentFavourite = await favourites.findOne({student:studentId})
  if(studentFavourite){
    let noteIndex = studentFavourite.notes.findIndex((p)=> p.note == noteId)
     
    if(noteIndex > -1){
        res.json({added:false,message:"Selected note is already in favourites"})
    }
    else{
      await favourites.updateOne({student:studentId},{$push:{notes:noteObj}})
      res.json({ added: true, message: "Selected note is added to favourites" })
    }
  }else{
    
    let favouriteObj = new favourites({
      student:studentId,
      notes:[noteObj]
    })
     
    favouriteObj.save()
    res.json({ added: true, message: "Selected note is added to favourites" })
  }
  
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Server error" });
}
}


module.exports.addFavouriteQuestion = async (req, res, next) => {
  try {
    let questionId = req.params.id
    let studentId = req.user


    let favouriteQuestion = await questions.findOne({ _id: questionId }).populate('branch', 'name').populate('subject', 'name')

    let questionObj = {
      question: questionId,
      branch: favouriteQuestion.branch.name,
      subject: favouriteQuestion.subject.name
    }

     

    let studentFavourite = await favourites.findOne({ student: studentId })
    if (studentFavourite) {
      let questionIndex = studentFavourite.questionPaper.findIndex((p) => p.question == questionId)

      if (questionIndex > -1) {
        res.json({ added: false, message: "Selected Question Paper is already in favourites" })
      }
      else {
        await favourites.updateOne({ student: studentId }, { $push: { questionPaper : questionObj } })
        res.json({ added: true, message: "Selected Question Paper is added to favourites" })
      }
    } else {
       
      let favouriteObj = new favourites({
        student: studentId,
        questionPaper: [questionObj]
      })
      favouriteObj.save()
      res.json({ added: true, message: "Selected Question Paper is added to favourites" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports.addFavouriteVideo = async (req, res, next) => {
  try {
    let videoId = req.params.id
    let studentId = req.user

    let favouriteVideo = await videos.findOne({ _id: videoId }).populate('branch', 'name').populate('subject', 'name')

    let videoObj = {
      video: videoId,
      branch: favouriteVideo.branch.name,
      subject: favouriteVideo.subject.name
    }

    let studentFavourite = await favourites.findOne({ student: studentId })
    if (studentFavourite) {
      let videoIndex = studentFavourite.videos.findIndex((p) => p.video == videoId)

      if (videoIndex > -1) {
        res.json({ added: false, message: "Selected video is already in favourites" })
      }
      else {
        await favourites.updateOne({ student: studentId }, { $push: { videos:videoObj } })
        res.json({ added: true, message: "Selected video is added to favourites" })
      }
    } else {
       
      let favouriteObj = new favourites({
        student: studentId,
        videos: [videoObj]
      })
      favouriteObj.save()
      res.json({ added: true, message: "Selected video is added to favourites" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}




module.exports.getFavouriteNotes = async (req, res, next) => {
  try {

    const id  = req.user

    const favourite = await favourites.findOne({ student: id }).populate('notes.note')
    const student = await students.findById(id)
    
    if (student.subscription) {
      const isActive = Date.now() < new Date(student.subscription.expiredAt);
      if (isActive) {
        const favouriteNote = favourite.notes
        res.json(favouriteNote);
      } else {
        const favourites = favourite.notes
        const favouriteNote = favourites.filter((notes)=>notes.note.exclusive == false)
        
        res.json(favouriteNote);
      }
    } else {
      const favourites = favourite.notes
      const favouriteNote = favourites.filter((notes) => notes.note.exclusive == false)
      res.json(favouriteNote);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports.getFavouriteQuestions = async (req, res, next) => {
  try {

    const id = req.user

    const favourite = await favourites.findOne({ student: id }).populate('questionPaper.question')
    const student = await students.findById(id)

    if (student.subscription) {
      const isActive = Date.now() < new Date(student.subscription.expiredAt);
      if (isActive) {
        const favouriteQuestions = favourite.questionPaper
        res.json(favouriteQuestions);
      } else {
        const favourites = favourite.questionPaper
        const favouriteQuestions = favourites.filter((ques) => ques.question.exclusive == false)
        res.json(favouriteQuestions);
      }
    } else {
      const favourites = favourite.questionPaper
      const favouriteQuestions = favourites.filter((ques) => ques.question.exclusive == false)
      res.json(favouriteQuestions);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports.getFavouriteVideos = async (req, res, next) => {
  try {

    const id = req.user

    const favourite = await favourites.findOne({ student: id }).populate('videos.video')
    const student = await students.findById(id)

    if (student.subscription) {
      const isActive = Date.now() < new Date(student.subscription.expiredAt);
      if (isActive) {
        const favouriteVideos = favourite.videos
        res.json(favouriteVideos);
      } else {
        const favourites = favourite.videos
        const favouriteVideos = favourites.filter((videos) => videos.video.exclusive == false)
        res.json(favouriteVideos);
      }
    } else {
      const favourites = favourite.videos
      const favouriteVideos = favourites.filter((videos) => videos.video.exclusive == false)
      res.json(favouriteVideos);
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports.removeFavouriteVideos = async (req, res, next) => {
  try {

    let videoId = req.params.id
    let student = req.user


    const favourite = await favourites.updateOne({ student},{$pull:{videos:{_id:videoId}}})
 
  
    res.json({ removed: true, message: "Video is removed from favourites" })


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.removeFavouriteQuestions = async (req, res, next) => {
  try {

    let questionId = req.params.id
    let student = req.user


    const favourite = await favourites.updateOne({ student }, { $pull: { questionPaper: { _id: questionId } } })


    res.json({ removed: true, message: "Question paper is removed from favourites" })


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.removeFavouriteNotes = async (req, res, next) => {
  try {

    let noteId = req.params.id
    let student = req.user


    const favourite = await favourites.updateOne({ student }, { $pull: { notes: { _id: noteId } } })


    res.json({ removed: true, message: "Note is removed from favourites" })


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}