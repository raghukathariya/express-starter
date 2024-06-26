import multer from "multer";
import path from "path";
import * as fs from "fs-extra";
const uploadOptions = () => ({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "/assets/uploads/");
      fs.ensureDir(uploadDir, (err) => {
        if (err) {
          console.error("Error creating directory", err);
          return cb(err, null);
        }
        cb(null, uploadDir);
      });
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname); // Generate a unique filename
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Allow only image files
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype} not allowed.`));
    }
  },
  limits: {
    fieldNameSize: 255, // Limit the field name size
    fileSize: 1024 * 1024 * 2, // Limit the file size to 2MB
  },
});

export const fileUploadOptions = multer(uploadOptions());
