const { notesUpload, adminAllNotes, adminApproveNotes, adminNoteListOrUnList } = require('../controller/notesController');
const { questionPaperUpload, getQuestionPapers, adminAllQuestionPapers, adminApproveQuestionPaper, adminQuestionPaperListOrUnList } = require('../controller/questionPaperController');
const { verifyStudent, verifyAdmin } = require('../middleware/verifyUser');
const {upload} = require('../middleware/fileUpload');
const { CheckStudent } = require('../middleware/checkUser');
const { addBoard, allBoards, adminAllBoards } = require('../controller/boardController');
const { addBranch, allBranches, adminAllBranches } = require('../controller/branchController');
const { addSubject, allSubjects, adminAllSubjects } = require('../controller/subjectController');
const { adminAllVideos, adminApproveVideos, adminVideoListOrUnList } = require('../controller/videosController');


const router = require('express').Router()

 router.post('/add-board',verifyAdmin,addBoard)
 router.get('/boards',verifyAdmin,adminAllBoards)
 router.post('/add-branch',verifyAdmin,addBranch)
 router.get('/branches',verifyAdmin,adminAllBranches)
 router.post('/add-subject',verifyAdmin,addSubject)
 router.get('/subjects',verifyAdmin,adminAllSubjects)
 router.get('/notes',verifyAdmin,adminAllNotes)
 router.get('/videos',verifyAdmin,adminAllVideos)
 router.get('/question-papers',verifyAdmin,adminAllQuestionPapers)
 router.get('/approve-notes',verifyAdmin,adminApproveNotes)
 router.get('/note-list-unlist',verifyAdmin,adminNoteListOrUnList)
 router.get('/approve-videos',verifyAdmin,adminApproveVideos)
 router.get('/video-list-unlist',verifyAdmin,adminVideoListOrUnList)
 router.get('/approve-question-paper',verifyAdmin,adminApproveQuestionPaper)
 router.get('/question-paper-list-unlist',verifyAdmin,adminQuestionPaperListOrUnList)

module.exports = router;