const multer = require('multer');
const path = require('path');


try {

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    let uploadPath = '';

    // Check the input field name to set the upload path
    if (file.fieldname === 'note') {
      uploadPath = path.join('public','uploads', 'notes');
    } else {
      uploadPath = path.join('public','uploads', 'question-papers');
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

module.exports.upload = multer({ storage });

}
catch (err) {
  console.log(err,"sf");
  res.status(500).json({ messge: "Something gone wrong"});
}