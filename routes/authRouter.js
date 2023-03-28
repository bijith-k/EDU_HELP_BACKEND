const { signup, signin, tutorSignup, tutorSignin, getOtp } = require('../controller/authController');

const router = require('express').Router()


router.post('/signup',getOtp)
router.post('/verify-otp',signup)
router.post('/signin',signin)
router.post('/tutor-signup',tutorSignup)
router.post('/tutor-signin',tutorSignin)





module.exports = router;
