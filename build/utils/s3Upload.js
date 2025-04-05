"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../config/config"));
const path_1 = __importDefault(require("path"));
var s3 = new aws_sdk_1.default.S3({
    accessKeyId: config_1.default.S3Credentials.accessKeyId,
    secretAccessKey: config_1.default.S3Credentials.secretAccessKey,
    region: config_1.default.S3Credentials.region,
});
const uploadToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!file || !file.originalname) {
            throw new Error("File is undefined or has no originalname property.");
        }
        const ext = path_1.default.extname(file.originalname.toString());
        const timestamp = Date.now();
        let keyName = "";
        const fieldName = file.fieldname;
        if (fieldName === "mainImage") {
            keyName = `uploads/blogMainImages/${timestamp}${ext}`;
        }
        else if (fieldName === "video") {
            keyName = `uploads/courseVideos/${timestamp}${ext}`;
        }
        else if (/^sections\[\d+\]\[image\]$/.test(fieldName)) {
            keyName = `uploads/sectionImages/${timestamp}${ext}`;
        }
        else {
            // default folder if needed
            keyName = `uploads/others/${timestamp}${ext}`;
        }
        const params = {
            Bucket: config_1.default.S3Credentials.bucket,
            Key: keyName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        console.log("Uploading to bucket:", params.Bucket);
        console.log("fieldName:", fieldName);
        console.log("Key Name:", keyName);
        const data = yield s3.upload(params).promise();
        return data.Location;
    }
    catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
});
exports.default = uploadToS3;
