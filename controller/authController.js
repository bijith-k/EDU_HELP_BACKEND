const students = require("../models/studentModel");
const tutors = require("../models/tutorModel");
const admins = require('../models/adminModel')
const boards = require('../models/boardModel')
const branch = require('../models/branchModel')

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const service_sid = process.env.TWILIO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

let signupData;
let tutorSignupData;






let sendPhoneOTP = (phone) => {
  return client.verify.v2.services(service_sid).verifications.create({
    to: `+91${phone}`,
    channel: "sms",
  });
};

let verifyPhoneOTP = async (phone, otpPhone) => {
  return client.verify.v2
    .services(service_sid)
    .verificationChecks.create({
      to: `+91${phone}`,
      code: otpPhone,
    })
    .then((verification_check) => {
      if (verification_check.status === "approved") {
        return Promise.resolve({ phoneStatus: "success", });
      } else {
        return Promise.reject({ phoneStatus: "error" });
      }
    }).catch((error) => {
      return Promise.reject({ phoneStatus: "error" });
    })
};

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const handleError = (err) => {
  if (err.code === 11000) {
    let errors = "Student with same email is there";
    return errors;
  } else {
    let errors = "Internal server error";
    return errors;
  }
};
const handleErrorT = (err) => {
  if (err.code === 11000) {
    let errors = "Tutor with same email is there";
    return errors;
  } else {
    let errors = "Internal server error";
    return errors;
  }
};

module.exports.getOtp = async (req, res, next) => {
  try {

    const { name, email, phone, branch, board, school, password, place } =
      req.body;


    const student = await students.findOne({ email });
    if (!student) {

      signupData = {
        name,
        email,
        phone,
        branch,
        board,
        school,
        password,
        place,
      };

      const otpEmail = Math.floor(1000 + Math.random() * 9000);
      otp = otpEmail;


      let phoneOtp = await sendPhoneOTP(phone);


      if (phoneOtp.status === 'pending') {
        res
          .status(200)
          .json({
            message: "OTP is sent to given phone number",
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




    } else {
      res
        .status(200)
        .json({
          message: "There is already a student with same email",
          otpSend: false,
        });
    }
  } catch (error) {
    console.log(error);
    const errors = handleError(error);
    res.status(400).json({ errors, otpSend: false });
  }
};

module.exports.signup = async (req, res, next) => {

  try {
    const { name, email, phone, branch, board, school, password, place } = signupData;
    const { otpPhone } = req.body;

    let phoneVerify = await verifyPhoneOTP(phone, otpPhone)


    if (phoneVerify.phoneStatus === "success") {
      const student = await students.create({
        name,
        email,
        phone,
        branch,
        board,
        school,
        password,
        place,
      });

      res
        .status(200)
        .json({ message: "Successfully registered", created: true });

    } else {

      res.status(400).json({ message: "Incorrect OTP", created: false });
    }

  } catch (error) {
    console.log(error, "er")
    if (error.phoneStatus === 'error') {
      res.status(400).json({ errors: "Entered OTP is incorrect", created: false });
    } else {
      let errors = handleError(error);
      res.status(400).json({ errors, created: false });
    }
  }
};

module.exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const student = await students.findOne({ email })
    if (student) {
      if (student.blocked) {
        res.json({ message: "Your account is blocked by the admin", created: false });
      } else {
        const auth = await bcrypt.compare(password, student.password);
        if (auth) {
          const token = createToken(student._id);
          res.json({ message: "Login successful", created: true, token, student });
        } else {
          res.json({ message: "Password is incorrect", created: false });
        }
      }
    } else {
      res.json({
        message: "No student with the entered email",
        created: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Something gone wrong", created: false });
  }
};

module.exports.getTutorOtp = async (req, res, next) => {
  try {

    const { name, email, phone, subjects, timeFrom, timeTo, profession, password, place, board, branch } = req.body;

    const tutor = await tutors.findOne({ email });
    if (!tutor) {

      tutorSignupData = { name, email, phone, subjects, timeFrom, timeTo, profession, password, place, board, branch }

      const otpEmail = Math.floor(1000 + Math.random() * 9000);
      otpTutor = otpEmail;

      // let info = await sendEmailOTP(email, otpEmail)

      // if (info.emailStatus === "success") {
      let phoneOtp = await sendPhoneOTP(phone);

      if (phoneOtp.status === "pending") {
        res
          .status(200)
          .json({
            message: "OTP is sent to given phone number",
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


    } else {
      res
        .status(200)
        .json({
          message: "There is already a tutor with same email",
          otpSend: false,
        });
    }
  } catch (error) {
    console.log(error);
    const errors = handleErrorT(error);
    res.status(400).json({ errors, otpSend: false });
  }
}
module.exports.tutorSignup = async (req, res, next) => {


  try {
    const { name, email, phone, subjects, timeFrom, timeTo, profession, password, place, board, branch } = tutorSignupData;
    const { otpPhone } = req.body;


    let phoneVerify = await verifyPhoneOTP(phone, otpPhone)

    if (phoneVerify.phoneStatus === "success") {
      const tutor = await tutors.create({
        name,
        email,
        phone,
        subjects,
        timeFrom,
        timeTo,
        profession,
        password,
        place,
        board,
        branch
      });
      res.status(200).json({ message: "Successfully registered", created: true });

    } else {

      res.status(200)
        .json({
          message: "Entered OTP  is incorrect",
          created: false,
        });
    }

  } catch (error) {
    console.log(error);
    if (error.phoneStatus === "error") {
      res
        .status(200)
        .json({
          message: "Entered OTP is incorrect",
          created: false,
        });
    } else {
      const errors = handleErrorT(error);
      res.status(400).json({ errors, created: false });
    }

  }
};

module.exports.tutorSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tutor = await tutors.findOne({ email }).populate('branch', 'name').populate('board', 'name')
    if (tutor) {
      if (tutor.blocked) {
        res.json({ message: "Your account is blocked by admin", created: false });
      } else {
        const auth = await bcrypt.compare(password, tutor.password);
        if (auth) {
          const token = createToken(tutor._id);
          if (tutor.approved) {
            res.json({ message: "Login successful", created: true, token, tutor });
          }
          else if (!tutor.approved && !tutor.rejected) {
            res.json({ message: "Approval pending", pending: true, tutor, token });
          }
          else if (tutor.rejected) {
            res.json({ message: "Application rejected", rejected: true, tutor, token });
          }

        } else {
          res.json({ message: "Password is incorrect", created: false });
        }
      }

    } else {
      res.json({ message: "No tutor with the entered email", created: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Something gone wrong", created: false });
  }
};


module.exports.adminSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await admins.findOne({ email });
    if (admin) {
      const auth = await bcrypt.compare(password, admin.password);
      if (auth) {
        const token = createToken(admin._id);
        res.json({ message: "Login successful", created: true, token, admin });
      } else {
        res.json({ message: "Password is incorrect", created: false });
      }
    } else {
      res.json({
        message: "No admin with the entered email",
        created: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Something gone wrong", created: false });
  }
};



module.exports.boards = async (req, res, next) => {
  try {

    const board = await boards.find()
    res.json({ status: true, message: "success", board });

  } catch (error) {
    console.log(error);
  }
}


module.exports.branches = async (req, res, next) => {
  try {

    const { board } = req.query

    if (!board) {
      const branches = await branch.find()
      res.json({ status: true, message: "success", branches });

    } else {
      const selectedBoard = await boards.findById(board)
      if (!selectedBoard) {

        return res.status(404).json({ message: 'selected board not found' })
      }
      const branches = await branch.find({ board: selectedBoard })
      res.json({ status: true, message: "success", branches });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server gone...' })
  }
}