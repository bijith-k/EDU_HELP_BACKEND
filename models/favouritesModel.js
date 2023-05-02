
const mongoose = require('mongoose');


const favouriteSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students"
  },
  notes: [
    {
      note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notes"
      },
      branch:{
        type:String
      },
      subject:{
        type:String
      }
    }
  ],
  questionPaper: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "question_papers"
      },
      branch: {
        type: String
      },
      subject: {
        type: String
      }
    }
  ],
  videos: [
    {
      video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "videos"
      },
      branch: {
        type: String
      },
      subject: {
        type: String
      }
    }
  ],


})
module.exports = mongoose.model("favourites", favouriteSchema);

