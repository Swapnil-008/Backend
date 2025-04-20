import multer from 'multer'
//multer is a middleware that processes multipart/form-data (used in file uploads).
//configuration of middleware for uploding file
const storage = multer.diskStorage({
    destination: function(req, file, cb)
    {
        cb(null, './public/temp') // Save file here temporarily
    },
    filename: function(req, file, cb){
        cb(null, file.originalname); // Keep original filename
    }
})

export const upload = multer({
    storage: storage
})