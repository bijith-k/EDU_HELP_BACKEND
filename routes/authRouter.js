const { signup, signin, tutorSignup, tutorSignin, getOtp, getTutorOtp, adminSignin, boards, branches } = require('../controller/authController');

const router = require('express').Router()


router.post('/signup',getOtp)
router.post('/verify-otp',signup)
router.post('/signin',signin)
router.post('/tutor-signup',getTutorOtp)
router.post('/verify-tutor-otp',tutorSignup)
router.post('/tutor-signin',tutorSignin)
router.post('/admin-signin',adminSignin)
router.get('/boards',boards)
router.get('/branches',branches)







module.exports = router;
