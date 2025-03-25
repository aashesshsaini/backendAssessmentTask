import { Document, Schema } from "mongoose";

export interface BlogDocument extends Document {
   title:string;
   mainImage:string;
   introduction:string;
   sections:[{
    image:string;
    title:string;
    description:string;
    bullets:string;
    paragraph:string;
   }],
   isDeleted:boolean;
}
