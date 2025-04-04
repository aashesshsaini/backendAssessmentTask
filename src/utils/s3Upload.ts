import AWS from "aws-sdk";
import config from "../config/config"
import path from "path";
import { Dictionary } from "../types";

    var s3 = new AWS.S3({
        accessKeyId:config.S3Credentials.accessKeyId,
        secretAccessKey:config.S3Credentials.secretAccessKey,
        region:config.S3Credentials.region,
      })

const uploadToS3 = async (file:Dictionary) => {
    try {
      if (!file || !file.originalname) {
        throw new Error("File is undefined or has no originalname property.");
      }
  
      console.log(config.S3Credentials.bucket);
      const ext = path.extname(file.originalname.toString());
      const params = {
        
        Bucket: config.S3Credentials.bucket as any,
        Key: "",
        Body: file.buffer,
        ContentType: file.mimetype,
      };
  
      var keyName:string="";
  
            if (
              file.fieldname === "video"
            ) {
              keyName = `uploads/${Date.now()}${ext}`;
            }  
  
  
      console.log("Key Name:", keyName);
  
      params.Key = keyName;
      const data = await s3.upload(params).promise();
      console.log("File uploaded successfully. Location:", data.Location);
      return data.Location;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  export default uploadToS3;
  