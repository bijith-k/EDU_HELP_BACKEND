const { CheckTutor } = require('../middleware/checkUser')
const { verifyTutor } = require('../middleware/verifyUser')
const handleUpload = require('../middleware/fileUpload');
const { notesUpload, getNotes } = require('../controller/notesController');
const { questionPaperUpload, getQuestionPapers } = require('../controller/questionPaperController');
const { videoUpload, getVideos } = require('../controller/videosController');
const { allBoards } = require('../controller/boardController');
const { allBranches } = require('../controller/branchController');
const { allSubjects } = require('../controller/subjectController');
const { addEvent } = require('../controller/eventController');


const router = require('express').Router()



router.post('/',CheckTutor)
router.get('/boards',verifyTutor,allBoards)
router.get('/branches',verifyTutor,allBranches)
router.get('/subjects',verifyTutor,allSubjects)
router.get('/uploaded-notes',verifyTutor,getNotes)
router.get('/uploaded-videos',verifyTutor,getVideos)
router.get('/uploaded-questions',verifyTutor,getQuestionPapers)
router.post('/upload-notes',verifyTutor,handleUpload('note'),notesUpload)
router.post('/upload-question-papers',verifyTutor,handleUpload('questions'),questionPaperUpload)
router.post('/upload-videos',verifyTutor,videoUpload)
router.post('/add-event',verifyTutor,handleUpload('poster'),addEvent)



module.exports = router