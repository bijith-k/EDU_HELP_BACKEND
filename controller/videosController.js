
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
     
    const video = await videos.find({listed:true}).populate('branch','name').populate('subject','name')
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



module.exports.adminApproveVideos = async(req,res,next) =>{
  try {
    console.log('in approve');
    const {video} = req.query
   await videos.updateOne({_id:video},{$set:{approved:true,listed:true}})
   res.json({ message: "Video is approved successfully", approved: true });
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", approved: false });
  }
}

module.exports.adminVideoListOrUnList = async(req,res,next) =>{
  try {
    const {video} = req.query
    const videoToListOrUnList = await videos.findById(video)
    if(videoToListOrUnList.listed){
      console.log("in");
      await videos.updateOne({_id:video},{$set:{listed:false}})
      res.json({message:'Video is successfully unlisted',success:true})
    }else{
      await videos.updateOne({_id:video},{$set:{listed:true}})
      res.json({message:'Video is successfully listed',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}