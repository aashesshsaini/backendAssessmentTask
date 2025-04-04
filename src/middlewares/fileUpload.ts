import multer from "multer";
import path from "path";

// Allowed video formats
const VIDEO_MIME_TYPES = ["video/mp4", "video/avi", "video/mov", "video/mkv",  "application/octet-stream", "image/jpg", "image/png"];


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); 
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, `${Date.now()}-${file.fieldname}${ext}`); 
//     }
// });

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (VIDEO_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only videos are allowed!"));
    }
};

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1000 * 1024 * 1024 } 
});

export default upload;




