const { notesUpload, getNotes, privatePublicNotes, deleteNotes } = require('../controller/notesController');
const { questionPaperUpload, getQuestionPapers, privatePublicQuestions, deleteQuestionPaper } = require('../controller/questionPaperController');
const { verifyStudent } = require('../middleware/verifyUser');
const handleUpload = require('../middleware/fileUpload');
const { CheckStudent } = require('../middleware/checkUser');
const { videoUpload, getVideos, privatePublicVideos, deleteVideos } = require('../controller/videosController');
const { allBoards } = require('../controller/boardController');
const { allBranches } = require('../controller/branchController');
const { allSubjects } = require('../controller/subjectController');
const { addEvent, getEvents } = require('../controller/eventController');
const { getPlans } = require('../controller/planController');
const { getTutors } = require('../controller/tutorController');
const { planPayment, verifyPayment, planDetails, updateProfile, getUploadsCounts, getSubscribedPlan, changePassword, passwordChangeOtp } = require('../controller/studentController');
const { newConversation, getConversation } = require('../controller/conversationController');
const { newMessage, getMessage } = require('../controller/messageController');
const { addFavouriteNote, addFavouriteQuestion, addFavouriteVideo, getFavouriteNotes, getFavouriteQuestions, getFavouriteVideos, removeFavouriteVideos, removeFavouriteNotes, removeFavouriteQuestions } = require('../controller/favouriteController');

const router = require('express').Router()

 
router.get('/',CheckStudent)
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
router.get('/get-upload-counts', verifyStudent, getUploadsCounts)
router.get('/add-favourite-note/:id', verifyStudent, addFavouriteNote)
router.get('/add-favourite-question/:id', verifyStudent, addFavouriteQuestion)
router.get('/add-favourite-video/:id', verifyStudent, addFavouriteVideo)
router.get('/favourite-notes', verifyStudent, getFavouriteNotes)
router.get('/favourite-questions', verifyStudent, getFavouriteQuestions)
router.get('/favourite-videos', verifyStudent, getFavouriteVideos)


router.put('/notes-private-public',verifyStudent,privatePublicNotes)
router.put('/videos-private-public',verifyStudent,privatePublicVideos)
router.put('/questions-private-public',verifyStudent,privatePublicQuestions)
router.put('/remove-favourite-note/:id', verifyStudent,removeFavouriteNotes)
router.put('/remove-favourite-questions/:id', verifyStudent,removeFavouriteQuestions)
router.put('/remove-favourite-video/:id', verifyStudent,removeFavouriteVideos)


router.post('/buy-plan', verifyStudent, planPayment)
router.post('/verify-payment', verifyStudent, verifyPayment)
router.post('/upload-notes', verifyStudent, handleUpload('note'), notesUpload)
router.post('/upload-question-papers', verifyStudent, handleUpload('questions'), questionPaperUpload)
router.post('/upload-videos', verifyStudent, videoUpload)
router.post('/add-event', verifyStudent, handleUpload('poster'), addEvent)
router.post('/edit-profile-details',verifyStudent, handleUpload('profilePic'),updateProfile)
router.post('/get-password-change-otp', verifyStudent,passwordChangeOtp)
router.post('/change-password',verifyStudent,changePassword)


router.delete('/delete-questions', verifyStudent, deleteQuestionPaper)
router.delete('/delete-notes', verifyStudent, deleteNotes)
router.delete('/delete-videos', verifyStudent, deleteVideos)

//message
router.post('/new-conversation',verifyStudent,newConversation)
router.get('/get-conversation/:userId', verifyStudent,getConversation)
router.post('/new-message',verifyStudent,newMessage)
router.get('/get-message/:conversationId',verifyStudent, getMessage)



module.exports = router;
