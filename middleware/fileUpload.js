const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    let uploadPath = '';
    
    
    // Check the input field name to set the upload path
    if (file.fieldname === 'note') {
      uploadPath = path.join('public','uploads', 'notes');
    } else if (file.fieldname === 'questions') {
      uploadPath = path.join('public','uploads', 'question-papers');
    } else if (file.fieldname === 'poster') {
      uploadPath = path.join('public','uploads', 'events');
    } else if (file.fieldname === 'profilePic') {
    uploadPath = path.join('public', 'uploads', 'profilePic');
    }
    else {
      uploadPath = path.join('public','uploads');
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

function handleUpload(fieldname){
   return function (req,res,next) {
    upload.single(fieldname)(req,res,(err)=>{
      if(err){
        console.log(err);
        return res.status(500).json({ messge: "Something gone wrong"});
      }
      next()
    })
   }
}

module.exports = handleUpload;


 