const jwt = require('jsonwebtoken')
const students = require('../models/studentModel')
const tutors = require('../models/tutorModel')
const admins = require('../models/adminModel')

module.exports.CheckStudent = (req, res, next) => {


  try {
    const authHeader = req.headers.authorization

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.json({ status: false, message: "Authentication failed" })
        } else {
          const student = await students.findById({ _id: decodedToken._id, blocked: false }).populate('branch', 'name').populate('board', 'name')
          if (student) {
            req.user = student._id
            res.json({ student, token, status: true, message: "User found" })

          } else {
            res.json({ status: false, message: "User not found" })
          }
        }
      })
    } else {
      res.json({ status: false, message: "No token found" })
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


module.exports.CheckTutor = (req, res, next) => {


  try {
    const authHeader = req.headers.authorization

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.json({ status: false, message: "Authentication failed" })
        } else {
          const tutor = await tutors.findOne({ _id: decodedToken._id, blocked: false }).populate('branch', 'name').populate('board', 'name')

          if (tutor) {
            req.user = tutor._id
            res.json({ tutor, token, status: true, message: "Tutor found" })
          } else {
            res.json({ status: false, message: "Tutor not found" })
          }
        }
      })
    } else {
      res.json({ status: false, message: "No token found" })
    }


  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }


}

module.exports.CheckAdmin = (req, res, next) => {


  try {
    const authHeader = req.headers.authorization

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.json({ status: false, message: "Authentication failed" })
        } else {
          const admin = await admins.findById({ _id: decodedToken._id })

          if (admin) {
            req.user = admin._id
            res.json({ status: true, message: "Admin found" })
          } else {
            res.json({ status: false, message: "Admin not found" })
          }
        }
      })
    } else {
      res.json({ status: false, message: "No token found" })
    }


  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }


}