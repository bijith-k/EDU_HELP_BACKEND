const { signup, signin, tutorSignup, tutorSignin, getOtp, getTutorOtp } = require('../controller/authController');

const router = require('express').Router()


router.post('/signup',getOtp)
router.post('/verify-otp',signup)
router.post('/signin',signin)
router.post('/tutor-signup',getTutorOtp)
router.post('/verify-tutor-otp',tutorSignup)
router.post('/tutor-signin',tutorSignin)





module.exports = router;
