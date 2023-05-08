const { CheckTutor } = require('../middleware/checkUser')
const { verifyTutor } = require('../middleware/verifyUser')
const handleUpload = require('../middleware/fileUpload');
const { notesUpload, getNotes, privatePublicNotes, deleteNotes } = require('../controller/notesController');
const { questionPaperUpload, getQuestionPapers, deleteQuestionPaper, privatePublicQuestions } = require('../controller/questionPaperController');
const { videoUpload, getVideos, deleteVideos, privatePublicVideos } = require('../controller/videosController');
const { allBoards } = require('../controller/boardController');
const { allBranches } = require('../controller/branchController');
const { allSubjects } = require('../controller/subjectController');
const { addEvent } = require('../controller/eventController');
const { getConversation } = require('../controller/conversationController');
const { newMessage, getMessage } = require('../controller/messageController');
const { getStudents } = require('../controller/studentController');
const { updateProfile, changePassword, passwordChangeOtp } = require('../controller/tutorController');

const router = require('express').Router()


router.get('/', CheckTutor)
router.get('/boards', verifyTutor, allBoards)
router.get('/branches', verifyTutor, allBranches)
router.get('/subjects', verifyTutor, allSubjects)
router.get('/uploaded-notes', verifyTutor, getNotes)
router.get('/uploaded-videos', verifyTutor, getVideos)
router.get('/uploaded-questions', verifyTutor, getQuestionPapers)
router.get('/get-students', verifyTutor, getStudents)


router.post('/upload-notes', verifyTutor, handleUpload('note'), notesUpload)
router.post('/upload-question-papers', verifyTutor, handleUpload('questions'), questionPaperUpload)
router.post('/upload-videos', verifyTutor, videoUpload)
router.post('/add-event', verifyTutor, handleUpload('poste'), addEvent)
router.post('/edit-profile-details', verifyTutor, handleUpload('profilePic'), updateProfile)
router.post('/get-password-change-otp', verifyTutor, passwordChangeOtp)
router.post('/change-password', verifyTutor, changePassword)


router.put('/notes-private-public', verifyTutor, privatePublicNotes)
router.put('/videos-private-public', verifyTutor, privatePublicVideos)
router.put('/questions-private-public', verifyTutor, privatePublicQuestions)


router.delete('/delete-notes', verifyTutor, deleteNotes)
router.delete('/delete-questions', verifyTutor, deleteQuestionPaper)
router.delete('/delete-videos', verifyTutor, deleteVideos)


router.get('/get-conversation/:userId', verifyTutor, getConversation)
router.post('/new-message', verifyTutor, newMessage)
router.get('/get-message/:conversationId', verifyTutor, getMessage)


module.exports = router