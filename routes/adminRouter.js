const { notesUpload, adminAllNotes, adminApproveNotes, adminNoteListOrUnList, updateNotes, adminRejectNotes } = require('../controller/notesController');
const { questionPaperUpload, getQuestionPapers, adminAllQuestionPapers, adminApproveQuestionPaper, adminQuestionPaperListOrUnList, updateQuestionPaper, adminRejectQuestionPaper } = require('../controller/questionPaperController');
const { verifyStudent, verifyAdmin } = require('../middleware/verifyUser');
const handleUpload = require('../middleware/fileUpload');
const { CheckStudent } = require('../middleware/checkUser');
const { addBoard, allBoards, adminAllBoards, updateBoard, adminBoardListOrUnList, boardContentCount } = require('../controller/boardController');
const { addBranch, allBranches, adminAllBranches, updateBranch, adminBranchListOrUnList } = require('../controller/branchController');
const { addSubject, allSubjects, adminAllSubjects, updateSubject } = require('../controller/subjectController');
const { adminAllVideos, adminApproveVideos, adminVideoListOrUnList, updateVideos, adminRejectVideos } = require('../controller/videosController');
const { adminAllEvents, adminEventListOrUnList, adminApproveEvent, updateEvent, adminRejectEvent } = require('../controller/eventController');
const { addPlan, adminAllPlans, adminPlanListOrUnList, updatePlans } = require('../controller/planController');
const { adminAllStudents, adminBlockUnblockStudent } = require('../controller/studentController');
const { adminAllTutors, adminBlockUnblockTutor, adminApproveTutor, adminRejectTutor } = require('../controller/tutorController');


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
router.get('/approve-notes', verifyAdmin, adminApproveNotes)
router.post('/reject-notes', verifyAdmin, adminRejectNotes)
 router.get('/note-list-unlist',verifyAdmin,adminNoteListOrUnList)
router.get('/approve-videos', verifyAdmin, adminApproveVideos)
router.post('/reject-videos', verifyAdmin, adminRejectVideos)
 router.get('/video-list-unlist',verifyAdmin,adminVideoListOrUnList)
 router.get('/event-list-unlist',verifyAdmin,adminEventListOrUnList)
 router.get('/plan-list-unlist',verifyAdmin,adminPlanListOrUnList)
router.get('/approve-question-paper', verifyAdmin, adminApproveQuestionPaper)
router.post('/reject-question-paper', verifyAdmin, adminRejectQuestionPaper)
router.get('/approve-events', verifyAdmin, adminApproveEvent)
router.get('/reject-events', verifyAdmin, adminRejectEvent)
router.get('/question-paper-list-unlist', verifyAdmin, adminQuestionPaperListOrUnList)
router.put('/board-list-unlist', verifyAdmin, adminBoardListOrUnList)
router.put('/branch-list-unlist', verifyAdmin, adminBranchListOrUnList)
router.get('/board-content-count', verifyAdmin,boardContentCount)

 
 router.post('/add-board',verifyAdmin,addBoard)
 router.post('/edit-notes',verifyAdmin,handleUpload('note'),updateNotes)
 router.post('/edit-question-papers',verifyAdmin,handleUpload('question'),updateQuestionPaper)
 router.post('/edit-videos',verifyAdmin,updateVideos)
 router.post('/edit-event',verifyAdmin,handleUpload('newPoster'),updateEvent)
 router.post('/edit-plans',verifyAdmin,updatePlans)
 router.post('/add-plan',verifyAdmin,addPlan)
router.post('/edit-board', verifyAdmin, updateBoard)
router.post('/edit-branch', verifyAdmin, updateBranch)
router.post('/edit-subject', verifyAdmin, updateSubject)

 router.put('/block-unblock-tutor',verifyAdmin,adminBlockUnblockTutor)
 router.put('/block-unblock-student',verifyAdmin,adminBlockUnblockStudent)
router.put('/approve-tutor', verifyAdmin, adminApproveTutor)
router.post('/reject-tutor', verifyAdmin, adminRejectTutor)




module.exports = router;
