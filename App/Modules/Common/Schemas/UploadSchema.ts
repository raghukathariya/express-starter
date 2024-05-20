import mongoose, { Document, Schema } from "mongoose";
import { Upload } from "../Models/Upload";

export type UploadDocument = Document & Upload;

const uploadSchema = new Schema<UploadDocument>(
  {
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    encoding: { type: String, required: true },
    size: { type: String, required: true },
    mimetype: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);


const UploadSchema = mongoose.model<UploadDocument>("Upload", uploadSchema);

export default UploadSchema;
