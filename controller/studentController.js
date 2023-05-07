const students = require('../models/studentModel')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const plans = require('../models/plansModel')
const notes = require('../models/notesModel')
const videos = require('../models/videosModel')
const questionPapers = require('../models/questionPaperModel')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Otp = require('../models/otpModel')

const key_id = process.env.KEY_ID
const key_secret = process.env.SECRET_KEY


 

let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

let sendChangePasswordOtp = (email, otp) => {

  return new Promise((resolve, reject) => {
    const mailOptions = {
      to: email,
      from: "eduhelp1@outlook.com",
      subject: "OTP for changing password ",
      html:
        "<h3>OTP for changing your password is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>", // html body
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject({ emailStatus: "error", error: error })
      } else {
        console.log("Email sent: " + info.response);
        resolve({ emailStatus: "success", info: info });
      }
    });

  })

};







module.exports.adminAllStudents = async(req,res,next) => {
  try {
    const student = await students.find().populate('branch','name').populate('board','name')
     
     res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports.adminBlockUnblockStudent = async(req,res,next) =>{
  try {
    const {student} = req.query
    const studentsToUpdate = await students.findById(student)
    if(studentsToUpdate.blocked){
    
      await students.updateOne({_id:student},{$set:{blocked:false}})
      res.json({message:'Student is successfully unblocked',success:true})
    }else{
      await students.updateOne({_id:student},{$set:{blocked:true}})
      res.json({message:'Student is successfully blocked',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}

module.exports.planPayment = async(req,res) =>{
     try {

      const plan = await plans.findById(req.body.id)
 

      const instance = new Razorpay({
        key_id,
        key_secret
      })

      const options = {
        amount:plan.price*100,
        currency:"INR",
        receipt:crypto.randomBytes(10).toString('hex')
      }

      instance.orders.create(options,(error,order) => {
        if(error){
          console.log(error);
          return res.status(500).json({message:'Something gone wrong'})
        }
        res.status(200).json({data:order})
      })
      
     } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
     }
}

module.exports.verifyPayment = async(req,res) => {
  try {
     
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan
    } = req.body
     

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSign = crypto
      .createHmac("sha256", key_secret)
    .update(sign.toString())
    .digest('hex');
     

    if(razorpay_signature === expectedSign){
      const startDate = new Date()
      const endDate = new Date()
     
      endDate.setMonth(endDate.getMonth()+ plan.duration)

      const selectedPlan = await plans.findById(plan._id)

      const subscription = {
        user: req.user,
        startedAt: startDate,
        expiredAt: endDate
      }

      selectedPlan.used_by.push(subscription)

      selectedPlan.save()

     const updatedStudents = await students.findByIdAndUpdate({_id:req.user},{
        $set:{
          subscription:{
            plan:plan._id,
            startedAt:startDate,
            expiredAt:endDate
          }
        }
      })
      if(updatedStudents){
        return res.status(200).json({ message: 'Payment verified successfully', verified: true })
      }else{
        return res.status(400).json({ message: 'Something gone wrong', verified: false })
      }
    }else{
      return res.status(400).json({ message: 'Invalid signature sent',verified: false })
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports.planDetails = async (req, res, next) => {
  try {

    const student = await students.findById(req.user)
    if(student.subscription){
      
      const isActive = Date.now() < new Date(student.subscription.expiredAt);
      
      if(isActive){
        return res.status(200).json({ message: 'Active Subscription found', subscribed: isActive })
      }else{
        return res.status(200).json({ message: 'Subscription expired', subscribed: isActive })
      }
    }else{
      return res.status(200).json({ message: 'You are not subscribed to any plans', subscribed: false })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}


module.exports.getStudents = async (req, res, next) => {
  try {
    const { id } = req.query
     
    if (id) {
      const student = await students.find({ _id: id, blocked: false }).populate('branch', 'name').populate('board', 'name')
      
      res.json(student);
    } else {
      const student = await students.find({ blocked: false }).populate('branch', 'name').populate('board', 'name')
     
      res.json(student);
    }



  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports.updateProfile = async(req,res) =>{
  try {
   
    const { id } = req.query


    let updatedData = {
      board: req.body.board,
      branch: req.body.branch,
      name: req.body.name,
      email:req.body.email,
      phone:req.body.phone,
      school:req.body.school
    }

    if (req.file) {
      updatedData.profilePicture = req.file.path.replace("public", "");
    }

    let updatedProfile = await students.findByIdAndUpdate({ _id: id }, updatedData)
    let student = await students.findById(id).populate('branch', 'name').populate('board', 'name')
    if (updatedProfile) {
      res.json({ message: "Profile is updated successfully",student, updated: true });
    } else {
      res.status(500).json({ message: "Error while updating", updated: false });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}

module.exports.getUploadsCounts = async(req,res) => {
  try {

    const  id  = req.user
    const noteCounts = (await notes.find({ uploadedBy: { $in: [id] } })).length
    const videoCounts = (await videos.find({ uploadedBy: { $in: [id] } })).length
    const questionCounts = (await questionPapers.find({ uploadedBy: { $in: [id] } })).length

    res.json({noteCounts, videoCounts, questionCounts});
     

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports.getSubscribedPlan = async (req, res, next) => {
  try {
     
    const  id  = req.user

    const subscribedPlan = await plans.findOne({
      used_by:{
        $elemMatch:{
          user:id,
          expiredAt: {$gte:new Date()}
        }
      }
    })
   
    if (subscribedPlan) {
      return res.status(200).json({ message: 'You have a subscription plan', plan: subscribedPlan, subscribed: true })
    } else {
      return res.status(200).json({ message: 'Your plan expired or you have no subscription', subscribed: false })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}



module.exports.passwordChangeOtp = async (req, res) => {
  try {
    const email = req.body.email

    const otpPassword = Math.floor(1000 + Math.random() * 9000);
     
    const otpObj = new Otp({
      email,
      otp: otpPassword,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
    });
    await otpObj.save();


    let info = await sendChangePasswordOtp(email,otpPassword)
    if(info.emailStatus === "success"){
    res
      .status(200)
      .json({
        message: "OTP is sent to given mail id",
        otpSend: true,
      });
    }else{
      res
        .status(200)
        .json({
          message: "Error while sending otp,please try again",
          otpSend: false,
        });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports.changePassword = async(req,res) =>{
  try {
    const {currentPassword,newPassword,otp,email} = req.body
    const id = req.user

    const otpObj = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpObj) {
      return res.status(200).json({ message: 'OTP is not valid or has expired' });
    }
    if (otp !== otpObj.otp) {
      return res.status(200).json({ message: 'Invalid OTP' });
    }
    if (otpObj.expiresAt < new Date()) {
      await otpObj.deleteOne()
      return res.status(200).json({ message: 'OTP has expired' });
    }
   
    
      const student = await students.findById(id)
      const auth = await bcrypt.compare(currentPassword, student.password)
      if (auth) {
        student.password = newPassword
        await student.save()
        await otpObj.deleteOne()
        return res.status(200).json({ message: 'Password changed successfully', updated: true })
      } else {
        return res.status(200).json({ message: 'Entered password is incorrect', updated: false })
      }
    
   
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}


