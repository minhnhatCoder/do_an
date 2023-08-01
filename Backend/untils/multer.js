const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
const uploads = multer({ storage }).array("files", 10);
module.exports = { uploads };
