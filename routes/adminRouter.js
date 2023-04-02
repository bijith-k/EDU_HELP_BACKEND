const { notesUpload, adminAllNotes } = require('../controller/notesController');
const { questionPaperUpload, getQuestionPapers, adminAllQuestionPapers } = require('../controller/questionPaperController');
const { verifyStudent, verifyAdmin } = require('../middleware/verifyUser');
const {upload} = require('../middleware/fileUpload');
const { CheckStudent } = require('../middleware/checkUser');
const { addBoard, allBoards, adminAllBoards } = require('../controller/boardController');
const { addBranch, allBranches, adminAllBranches } = require('../controller/branchController');
const { addSubject, allSubjects, adminAllSubjects } = require('../controller/subjectController');
const { adminAllVideos } = require('../controller/videosController');


const router = require('express').Router()

 router.post('/add-board',verifyAdmin,addBoard)
 router.get('/boards',adminAllBoards)
 router.post('/add-branch',verifyAdmin,addBranch)
 router.get('/branches',adminAllBranches)
 router.post('/add-subject',verifyAdmin,addSubject)
 router.get('/subjects',adminAllSubjects)
 router.get('/notes',adminAllNotes)
 router.get('/videos',adminAllVideos)
 router.get('/question-papers',adminAllQuestionPapers)


module.exports = router;
