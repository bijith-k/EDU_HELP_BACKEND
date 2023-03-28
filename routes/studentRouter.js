const { verifyStudent } = require('../middleware/authData');

const router = require('express').Router()

 
router.post('/',verifyStudent)


module.exports = router;
