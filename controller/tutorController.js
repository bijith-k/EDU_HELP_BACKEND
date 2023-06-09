const tutors = require('../models/tutorModel')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Otp = require('../models/otpModel')




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


module.exports.adminAllTutors = async (req, res, next) => {
  try {
    const tutor = await tutors.find({ rejected: false }).populate('branch', 'name').populate('board', 'name')

    res.json(tutor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports.adminBlockUnblockTutor = async (req, res, next) => {
  try {
    const { tutor } = req.query
    const tutorsToUpdate = await tutors.findById(tutor)
    if (tutorsToUpdate.blocked) {
      await tutors.updateOne({ _id: tutor }, { $set: { blocked: false } })
      res.json({ message: 'Tutor is successfully unblocked', success: true })
    } else {
      await tutors.updateOne({ _id: tutor }, { $set: { blocked: true } })
      res.json({ message: 'Tutor is successfully blocked', success: true })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", success: false });
  }
}


module.exports.getTutors = async (req, res, next) => {
  try {
    const { id } = req.query
    if (id) {
      const tutor = await tutors.find({ _id: id, blocked: false, rejected: false, approved: true }).populate('branch', 'name').populate('board', 'name')

      res.json(tutor);
    } else {
      const tutor = await tutors.find({ blocked: false, rejected: false, approved: true }).populate('branch', 'name').populate('board', 'name')

      res.json(tutor);
    }



  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports.updateProfile = async (req, res) => {
  try {

    const { id } = req.query


    let updatedData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subjects: req.body.subjects,
      timeFrom: req.body.timeFrom,
      timeTo: req.body.timeTo,
      place: req.body.place,
    }

    if (req.file) {
      updatedData.profilePicture = req.file.path.replace("public", "");
    }

    let updatedProfile = await tutors.findByIdAndUpdate({ _id: id }, updatedData)
    let tutor = await tutors.findById(id).populate('branch', 'name').populate('board', 'name')
    if (updatedProfile) {
      res.json({ message: "Profile is updated successfully", tutor, updated: true });
    } else {
      res.status(500).json({ message: "Error while updating", updated: false });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", updated: false });
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


    let info = await sendChangePasswordOtp(email, otpPassword)
    if (info.emailStatus === "success") {
      res
        .status(200)
        .json({
          message: "OTP is sent to given mail id",
          otpSend: true,
        });
    } else {
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

module.exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, otp, email } = req.body
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


    const tutor = await tutors.findById(id)
    const auth = await bcrypt.compare(currentPassword, tutor.password)
    if (auth) {
      tutor.password = newPassword
      await tutor.save()
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


module.exports.reApply = async(req,res) =>{
  try {
    const id = req.user
     
    let updatedData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subjects: req.body.subjects,
      timeFrom: req.body.timeFrom,
      timeTo: req.body.timeTo,
      place: req.body.place,
      profession:req.body.profession,
      board: req.body.board,
      branch: req.body.branch,
      rejected:false,
      $unset: {
        rejection_reason: 1
      }
    }

    let updatedProfile = await tutors.findByIdAndUpdate({ _id: id }, updatedData)
    let tutor = await tutors.findById(id).populate('branch', 'name').populate('board', 'name')

    if (updatedProfile) {
      res.json({ message: "Application is submitted",tutor, submitted: true });
    } else {
      res.status(500).json({ message: "Error while submitting", submitted: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}




