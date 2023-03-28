const { signup, signin, tutorSignup, tutorSignin } = require('../controller/authController');

const router = require('express').Router()


router.post('/signup',signup)
router.post('/signin',signin)
router.post('/tutor-signup',tutorSignup)
router.post('/tutor-signin',tutorSignin)





module.exports = router;
