const tutors = require('../models/tutorModel')
const nodemailer = require("nodemailer");
const plans = require('../models/plansModel')



let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

let sendEmail = (name, email, reason) => {
  return new Promise((resolve, reject) => {
    let mailOptions;

    if (reason) {
      mailOptions = {
        to: email,
        from: "eduhelp1@outlook.com",
        subject: "Regarding application to signup as tutor",
        html:
          "<h2>Hi " + name + ",</h2>" +
          "<h3>Sorry to inform you that, your application to signup in EDU-HELP is rejected</h3>" +
          "<h3 style='font-weight:bold;'> It is because " +
          reason +
          "</h3>",
      };
      // return transporter.sendMail(mailOptions);
    } else {
      mailOptions = {
        to: email,
        from: "eduhelp1@outlook.com",
        subject: "Regarding application to signup as tutor",
        html:
          "<h2>Hi " + name + ",</h2>" +
          "<h2 style='font-weight:bold;'>Congratulations!</h2>" +
          "<h3 >Your application to join as a tutor in EDU-HELP is approved.</h3>" +
          "<h3 style='font-weight:bold;'>The team wishing you a happy teaching!</h3>" +
          "<h4 style='font-weight:bold;'><a href='https://edu-help.netlify.app/tutor'>Click here <a/>to login to your account </h1>"
      };
      // return transporter.sendMail(mailOptions);
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject({ status: "error", error: error })
      } else {
        console.log("Email sent: " + info.response);
        resolve({ status: "success", info: info });
      }
    });


  })



};


module.exports.adminApproveTutor = async (req, res, next) => {
  try {
    const { tutor } = req.query

    let tutorData = await tutors.findById(tutor)
    let info = await sendEmail(tutorData.name, tutorData.email)

    await tutors.updateOne({ _id: tutor }, { $set: { approved: true } })



    if (info.status === "success") {
      res.json({ message: 'Tutor is successfully approved and email sent', approved: true })
    } else {
      res.json({ message: 'Tutor is successfully approved but error in email sending', approved: true })
    }



  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", approved: false });
  }
}

module.exports.adminRejectTutor = async (req, res, next) => {
  try {
    const { tutor } = req.query

    let tutorData = await tutors.findById(tutor)
    let info = await sendEmail(tutorData.name, tutorData.email, req.body.rejectionReason)

    await tutors.updateOne({ _id: tutor }, { $set: { rejected: true, rejection_reason: req.body.rejectionReason } })


    if (info.status === "success") {
      res.json({ message: 'Tutor is rejected successfully and email sent', rejected: true })
    } else {
      res.json({ message: 'Tutor is rejected successfully but error in email sending', rejected: true })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", rejected: false });
  }
}



module.exports.activePlans = async (req, res) => {
  try {

    const plan = await plans.aggregate([
      {
        $unwind: "$used_by"
      },
      {
        $match: {
          "used_by.expiredAt": { $gte: new Date() }
        }
      },
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 }
        }
      }
    ]);


    res.json({ planCount: plan });


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong" });
  }
}