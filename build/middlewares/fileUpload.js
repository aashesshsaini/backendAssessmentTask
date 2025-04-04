"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Allowed video formats
const VIDEO_MIME_TYPES = ["video/mp4", "video/avi", "video/mov", "video/mkv", "application/octet-stream", "image/jpg", "image/png"];
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); 
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, `${Date.now()}-${file.fieldname}${ext}`); 
//     }
// });
const fileFilter = (req, file, cb) => {
    if (VIDEO_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type. Only videos are allowed!"));
    }
};
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1000 * 1024 * 1024 }
});
exports.default = upload;
