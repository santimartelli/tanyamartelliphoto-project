// multerConfig.js
const multer = require('multer');
const path = require('path');

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../resources/static/assets/uploads/'))
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-tmphoto-${file.originalname}`)
  }
});

const upload = multer({ storage: storage, fileFilter: imageFilter });

module.exports = upload;
