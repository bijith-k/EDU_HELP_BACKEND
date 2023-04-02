const students = require("../models/studentModel");
const tutors = require("../models/tutorModel");
const admins = require('../models/adminModel')
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const service_sid = process.env.TWILIO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

let signupData;
let otp = null;
let tutorSignupData;
let otpTutor = null;

let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

let sendEmailOTP = (email,otpEmail) => {
  
  console.log(otpEmail);

  const mailOptions = {
    to: email,
    from: "eduhelp1@outlook.com",
    subject: "Otp for registration is: ",
    html:
      "<h3>OTP for email verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otpEmail +
      "</h1>", // html body
  };
  return transporter.sendMail(mailOptions);
   
};

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
        return Promise.resolve("OTP verification successful");
      } else {
        return Promise.reject(new Error("OTP verification failed"));
      }
    });
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
    console.log(req.body);
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

      
      sendEmailOTP(email,otpEmail)
        .then((info) => {
          console.log(`Message sent: ${info.messageId}`);
          console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        })
        .catch((error) => {
          throw error;
        });
      sendPhoneOTP(phone)
        .then((verification) => {
          console.log(`OTP sent to ${verification.to} `);
        })
        .catch((error) => {
          throw error;
        });
      
      res
        .status(200)
        .json({
          message: "OTP is send to given email and phone number",
          otpSend: true,
        });
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
  console.log("inn");
  const { name, email, phone, branch, board, school, password, place } =
    signupData;
  const { otpPhone, otpEmail } = req.body;

  try {
    if (otpEmail == otp) {
      console.log("in that");
      verifyPhoneOTP(phone, otpPhone)
        .then(async () => {
          console.log("OTP verification successful");
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
        })
        .catch((error) => {
          console.log(error);
          res
            .status(200)
            .json({
              message: "Entered OTP from mobile is incorrect",
              created: false,
            });
           
        });
       
    } else {
      res
        .status(200)
        .json({
          message: "Entered OTP from email is incorrect",
          created: false,
        });
    }
  } catch (error) {
    console.log(error, "kkk");
    let errors = handleError(error);
    res.status(400).json({ errors, created: false });
  }
};

module.exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const student = await students.findOne({ email });
    if (student) {
      const auth = await bcrypt.compare(password, student.password);
      if (auth) {
        const token = createToken(student._id);
        res.json({ messge: "Login successful", created: true, token, student });
      } else {
        res.json({ message: "Password is incorrect", created: false });
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

module.exports.getTutorOtp = async (req,res,next) => {
  try {
    const { name,email, phone, subjects, timeFrom, timeTo,profession,password,place,} = req.body;

    const tutor = await tutors.findOne({ email });
    if(!tutor){

      tutorSignupData = { name,email, phone, subjects, timeFrom, timeTo,profession,password,place,}

      const otpEmail = Math.floor(1000 + Math.random() * 9000);
  otpTutor = otpEmail;

      sendEmailOTP(email,otpEmail)
        .then((info) => {
          console.log(`Message sent: ${info.messageId}`);
          console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        })
        .catch((error) => {
          throw error;
        });
      sendPhoneOTP(phone)
        .then((verification) => {
          console.log(`OTP sent to ${verification.to} `);
        })
        .catch((error) => {
          throw error;
        });
      
      res
        .status(200)
        .json({
          message: "OTP is send to given email and phone number",
          otpSend: true,
        });
    }else {
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
  const { name,email, phone, subjects, timeFrom, timeTo,profession,password,place,} = tutorSignupData;
  const { otpPhone, otpEmail } = req.body;
  try {

    if(otpEmail == otpTutor){
      console.log("innnnn");

      verifyPhoneOTP(phone,otpPhone).then(async()=>{
        console.log('otp verified');
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
        });
    res.status(200).json({ message: "Successfully registered", created: true });

      }).catch((error)=>{
        console.log(error);
        res
            .status(200)
            .json({
              message: "Entered OTP from mobile is incorrect",
              created: false,
            });
      })

    }else{
      res
        .status(200)
        .json({
          message: "Entered OTP from email is incorrect",
          created: false,
        });
    }

  } catch (error) {
    console.log(error,"tutorr");
    const errors = handleErrorT(error);
    res.status(400).json({ errors, created: false });
  }
};

module.exports.tutorSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tutor = await tutors.findOne({ email });
    if (tutor) {
      const auth = await bcrypt.compare(password, tutor.password);
      if (auth) {
        const token = createToken(tutor._id);
        res.json({ messge: "Login successful", created: true, token, tutor });
      } else {
        res.json({ message: "Password is incorrect", created: false });
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
        res.json({ messge: "Login successful", created: true, token,admin });
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