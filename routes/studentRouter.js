const { notesUpload, getNotes } = require('../controller/notesController');
const { questionPaperUpload, getQuestionPapers } = require('../controller/questionPaperController');
const { verifyStudent } = require('../middleware/verifyUser');
const {upload} = require('../middleware/fileUpload');
const { CheckStudent } = require('../middleware/checkUser');
const { videoUpload, getVideos } = require('../controller/videosController');
const { allBoards } = require('../controller/boardController');
const { allBranches } = require('../controller/branchController');
const { allSubjects } = require('../controller/subjectController');


const router = require('express').Router()

 
router.post('/',CheckStudent)
router.post('/upload-notes',verifyStudent,upload.single('note'),notesUpload)
router.post('/upload-question-papers',verifyStudent,upload.single('questions'),questionPaperUpload)
router.post('/upload-videos',verifyStudent,videoUpload)
router.get('/get-question-papers',getQuestionPapers)
router.get('/get-notes',getNotes)
router.get('/get-videos',getVideos)
router.get('/boards',allBoards)
router.get('/branches',allBranches)
router.get('/subjects',allSubjects)





module.exports = router;
