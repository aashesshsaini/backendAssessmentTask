import AWS from "aws-sdk";
import config from "../config/config"
import path from "path";
import { Dictionary } from "../types";

    var s3 = new AWS.S3({
        accessKeyId:config.S3Credentials.accessKeyId,
        secretAccessKey:config.S3Credentials.secretAccessKey,
        region:config.S3Credentials.region,
      })

      const uploadToS3 = async (file: Dictionary) => {
        try {
          if (!file || !file.originalname) {
            throw new Error("File is undefined or has no originalname property.");
          }
      
          const ext = path.extname(file.originalname.toString());
          const timestamp = Date.now();
      
          let keyName = "";
          const fieldName = file.fieldname;
      
          if (fieldName === "mainImage") {
            keyName = `uploads/blogMainImages/${timestamp}${ext}`;
          } else if (fieldName === "video") {
            keyName = `uploads/courseVideos/${timestamp}${ext}`;
          } else if (/^sections\[\d+\]\[image\]$/.test(fieldName)) {
            keyName = `uploads/sectionImages/${timestamp}${ext}`;
          } else {
            // default folder if needed
            keyName = `uploads/others/${timestamp}${ext}`;
          }
      
          const params = {
            Bucket: config.S3Credentials.bucket as string,
            Key: keyName,
            Body: file.buffer,
            ContentType: file.mimetype,
          };
      
          console.log("Uploading to bucket:", params.Bucket);
          console.log("fieldName:", fieldName);
          console.log("Key Name:", keyName);
      
          const data = await s3.upload(params).promise();
          return data.Location;
        } catch (error) {
          console.error("Error uploading file:", error);
          throw error;
        }
      };
      

  export default uploadToS3;
  