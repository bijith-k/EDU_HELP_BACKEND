
const videos = require('../models/videosModel')
const students = require('../models/studentModel')


module.exports.videoUpload = async(req,res,next) =>{
  try {
     
    const user = req.user
   
    const video = new videos({
      board: req.body.board,
      branch: req.body.branch,
      subject: req.body.subject,
      video_name: req.body.videoName,
      video_link:req.body.videoLink,
      exclusive: req.body.exclusive,
      uploadedBy: user,
    });

    await video.save();
    
    res.json({ message: "Video uploaded successfully", uploaded: true });


  } catch (error) {
console.log(error);
res.status(500).json({ message: "Something gone wrong", uploaded: false });
  }
}


module.exports.getVideos = async(req,res,next) =>{
  try {
     const {id} = req.query
    const { studentId } = req.query
    let user = req.user
    if(id){
     
      const video = await videos.find({uploadedBy:{$in:[user]}}).populate('branch','name').populate('subject','name')
      res.json(video);
    } else if (studentId) {
      const student = await students.findById(user)
      if (student.subscription) {
        const isActive = Date.now() < new Date(student.subscription.expiredAt);
        if (isActive) {
          const video = await videos.find({ listed: true, private: false }).populate('branch', 'name').populate('subject', 'name')
          res.json(video);
        } else {
          const video = await videos.find({ listed: true, private: false, exclusive: false }).populate('branch', 'name').populate('subject', 'name')
          res.json(video);
        }
      } else {
        const video = await videos.find({ listed: true, private: false, exclusive: false }).populate('branch', 'name').populate('subject', 'name')
        res.json(video);
      }
    }
    else{
      
      const video = await videos.find({listed:true,private:false}).populate('branch','name').populate('subject','name')
       
      res.json(video);
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.adminAllVideos = async(req,res,next) =>{
  try {
    if(req.query.id){
      
      const {id} = req.query
       
    const video = await videos.findOne({_id:id}).populate('branch','name').populate('subject','name').populate('board','name')
    res.json(video);
    }else{
      const video = await videos.find({rejected:false}).populate('branch','name').populate('subject','name').populate('board','name')
    
    res.json(video);
     }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports.adminApproveVideos = async(req,res,next) =>{
  try {
     
    const {video} = req.query
   await videos.updateOne({_id:video},{$set:{approved:true,listed:true}})
   res.json({ message: "Video is approved successfully", approved: true });
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", approved: false });
  }
}

module.exports.adminRejectVideos = async (req, res, next) => {
  try {
     
    const { video } = req.query
    await videos.updateOne({ _id: video }, { $set: { rejected: true, rejection_reason: req.body.rejectionReason } })
    res.json({ message: "Video is rejected successfully", rejected: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", rejected: false });
  }
}

module.exports.adminVideoListOrUnList = async(req,res,next) =>{
  try {
    const {video} = req.query
    const videoToListOrUnList = await videos.findById(video)
    if(videoToListOrUnList.listed){
      
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


module.exports.updateVideos = async(req,res,next) =>{
  try {
    
    const {video} = req.query

    let updatedData = {
      board:req.body.board,
      branch:req.body.branch,
      subject:req.body.subject,
      video_name:req.body.videoName,
      video_link:req.body.videoLink
    }

  
    let updatedVideo  = await videos.findByIdAndUpdate({_id:video},updatedData)

    if(updatedVideo){
      res.json({ message: "video is updated successfully", updated: true });
    }else{
res.status(500).json({ message: "Error while updating", updated: false });
    }
     
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}

module.exports.privatePublicVideos = async(req,res,next) =>{
  try {
    const {id} = req.query
    
    const videoToUpdate = await videos.findById(id)
    if(videoToUpdate.private){
     
      await videos.updateOne({_id:id},{$set:{private:false}})
      res.json({message:'Video is successfully made public',success:true})
    }else{
      await videos.updateOne({_id:id},{$set:{private:true}})
      res.json({message:'Video is successfully made private',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}

module.exports.deleteVideos = async (req, res) => {
  try {
    const { id } = req.query

    const video = await videos.findById(id)
    if (!video) {
      return res.status(404).json({ message: "Video not found" })
    }

    await videos.deleteOne({ _id: id })
    res.json({ message: "Video removed successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", success: false });
  }
}