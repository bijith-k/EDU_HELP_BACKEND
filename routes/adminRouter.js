const { notesUpload, adminAllNotes, adminApproveNotes, adminNoteListOrUnList, updateNotes } = require('../controller/notesController');
const { questionPaperUpload, getQuestionPapers, adminAllQuestionPapers, adminApproveQuestionPaper, adminQuestionPaperListOrUnList, updateQuestionPaper } = require('../controller/questionPaperController');
const { verifyStudent, verifyAdmin } = require('../middleware/verifyUser');
const handleUpload = require('../middleware/fileUpload');
const { CheckStudent } = require('../middleware/checkUser');
const { addBoard, allBoards, adminAllBoards } = require('../controller/boardController');
const { addBranch, allBranches, adminAllBranches } = require('../controller/branchController');
const { addSubject, allSubjects, adminAllSubjects } = require('../controller/subjectController');
const { adminAllVideos, adminApproveVideos, adminVideoListOrUnList, updateVideos } = require('../controller/videosController');
const { adminAllEvents, adminEventListOrUnList, adminApproveEvent, updateEvent } = require('../controller/eventController');
const { addPlan, adminAllPlans, adminPlanListOrUnList, updatePlans } = require('../controller/planController');
const { adminAllStudents, adminBlockUnblockStudent } = require('../controller/studentController');
const { adminAllTutors, adminBlockUnblockTutor } = require('../controller/tutorController');


const router = require('express').Router()

 router.get('/boards',verifyAdmin,adminAllBoards)
 router.post('/add-branch',verifyAdmin,addBranch)
 router.get('/branches',verifyAdmin,adminAllBranches)
 router.post('/add-subject',verifyAdmin,addSubject)
 router.get('/subjects',verifyAdmin,adminAllSubjects)
 router.get('/notes',verifyAdmin,adminAllNotes)
 router.get('/videos',verifyAdmin,adminAllVideos)
 router.get('/events',verifyAdmin,adminAllEvents)
 router.get('/plans',verifyAdmin,adminAllPlans)
 router.get('/students',verifyAdmin,adminAllStudents)
 router.get('/tutors',verifyAdmin,adminAllTutors)
 router.get('/question-papers',verifyAdmin,adminAllQuestionPapers)
 router.get('/approve-notes',verifyAdmin,adminApproveNotes)
 router.get('/note-list-unlist',verifyAdmin,adminNoteListOrUnList)
 router.get('/approve-videos',verifyAdmin,adminApproveVideos)
 router.get('/video-list-unlist',verifyAdmin,adminVideoListOrUnList)
 router.get('/event-list-unlist',verifyAdmin,adminEventListOrUnList)
 router.get('/plan-list-unlist',verifyAdmin,adminPlanListOrUnList)
 router.get('/approve-question-paper',verifyAdmin,adminApproveQuestionPaper)
 router.get('/approve-event',verifyAdmin,adminApproveEvent)
 router.get('/question-paper-list-unlist',verifyAdmin,adminQuestionPaperListOrUnList)

 
 router.post('/add-board',verifyAdmin,addBoard)
 router.post('/edit-notes',verifyAdmin,handleUpload('note'),updateNotes)
 router.post('/edit-question-papers',verifyAdmin,handleUpload('question'),updateQuestionPaper)
 router.post('/edit-videos',verifyAdmin,updateVideos)
 router.post('/edit-event',verifyAdmin,handleUpload('newPoster'),updateEvent)
 router.post('/edit-plans',verifyAdmin,updatePlans)
 router.post('/add-plan',verifyAdmin,addPlan)

 router.put('/block-unblock-tutor',verifyAdmin,adminBlockUnblockTutor)
 router.put('/block-unblock-student',verifyAdmin,adminBlockUnblockStudent)





module.exports = router;
