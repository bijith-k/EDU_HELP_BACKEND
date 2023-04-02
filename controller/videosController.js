
const videos = require('../models/videosModel')


module.exports.videoUpload = async(req,res,next) =>{
  try {
    console.log("innnnn");

    console.log(req.body,"body");
    const user = req.user
    console.log(user);
console.log(req.body);
    const video = new videos({
      board: req.body.board,
      branch: req.body.branch,
      subject: req.body.subject,
      video_name: req.body.videoName,
      video_link:req.body.videoLink,
      uploadedBy: user,
    });

    await video.save();
    
    res.json({ messge: "Video uploaded successfully", uploaded: true });


  } catch (error) {
console.log(error);
res.status(500).json({ messge: "Something gone wrong", uploaded: false });
  }
}


module.exports.getVideos = async(req,res,next) =>{
  try {
     
    const video = await videos.find({listed:false}).populate('branch','name').populate('subject','name')
    console.log(video,"ll");
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.adminAllVideos = async(req,res,next) =>{
  try {
     
    const video = await videos.find().populate('branch','name').populate('subject','name').populate('board','name')
    console.log(video,"ll");
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}