const { notesUpload, getNotes, privatePublicNotes } = require('../controller/notesController');
const { questionPaperUpload, getQuestionPapers, privatePublicQuestions } = require('../controller/questionPaperController');
const { verifyStudent } = require('../middleware/verifyUser');
const handleUpload = require('../middleware/fileUpload');
const { CheckStudent } = require('../middleware/checkUser');
const { videoUpload, getVideos, privatePublicVideos } = require('../controller/videosController');
const { allBoards } = require('../controller/boardController');
const { allBranches } = require('../controller/branchController');
const { allSubjects } = require('../controller/subjectController');
const { addEvent, getEvents } = require('../controller/eventController');
const { getPlans } = require('../controller/planController');
const { getTutors } = require('../controller/tutorController');
const { planPayment, verifyPayment, planDetails, updateProfile, getUploadsCounts, getSubscribedPlan, changePassword } = require('../controller/studentController');
const { newConversation, getConversation } = require('../controller/conversationController');
const { newMessage, getMessage } = require('../controller/messageController');

const router = require('express').Router()

 
router.post('/',CheckStudent)
router.post('/upload-notes',verifyStudent,handleUpload('note'),notesUpload)
router.post('/upload-question-papers',verifyStudent,handleUpload('questions'),questionPaperUpload)
router.post('/upload-videos',verifyStudent,videoUpload)
router.post('/add-event',verifyStudent,handleUpload('poster'),addEvent)
router.get('/get-question-papers',verifyStudent,getQuestionPapers)
router.get('/get-notes',verifyStudent,getNotes)
router.get('/get-videos',verifyStudent,getVideos)
router.get('/get-events',verifyStudent,getEvents)
router.get('/get-plans',verifyStudent,getPlans)
router.get('/get-tutors',verifyStudent,getTutors)
router.get('/boards',verifyStudent,allBoards)
router.get('/branches',verifyStudent,allBranches)
router.get('/subjects',verifyStudent,allSubjects)
router.get('/plan-details', verifyStudent, planDetails)
router.get('/get-subscribed-plan', verifyStudent, getSubscribedPlan)
router.get('/get-upload-counts',verifyStudent, getUploadsCounts)

router.put('/notes-private-public',verifyStudent,privatePublicNotes)
router.put('/videos-private-public',verifyStudent,privatePublicVideos)
router.put('/questions-private-public',verifyStudent,privatePublicQuestions)


router.post('/buy-plan', verifyStudent, planPayment)
router.post('/verify-payment', verifyStudent, verifyPayment)

router.post('/edit-profile-details',verifyStudent, handleUpload('profilePic'),updateProfile)
router.post('/change-password',verifyStudent,changePassword)

//message
router.post('/new-conversation',verifyStudent,newConversation)
router.get('/get-conversation/:userId', verifyStudent,getConversation)
router.post('/new-message',verifyStudent,newMessage)
router.get('/get-message/:conversationId',verifyStudent, getMessage)

module.exports = router;
