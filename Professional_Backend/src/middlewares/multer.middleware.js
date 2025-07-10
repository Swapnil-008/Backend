import multer from "multer";
// multer is a middleware for Node.js used to handle multipart/form-data, which is the encoding type used when uploading files via HTML forms.
// It's often used with Express.js to receive file uploads and store them either in memory or on disk (local storage).
// configuration of middleware for uploding file
const storage = multer.diskStorage({
  // req -> contains the json data and all comes from the user
  // file -> contains the file sent by the user
  destination: function (req, file, cb) {  //cb -> call back
    cb(null, "./public/temp"); // Save file here temporarily  //first parameter -> error
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep original filename
  },
});

export const upload = multer({
  storage: storage,
});