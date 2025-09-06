// middleware/upload.js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryPkg from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const { v2: cloudinary } = cloudinaryPkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Factory function for dynamic folder-based uploads
const getUploadMiddleware = (folderName = "default_uploads") => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      resource_type: "auto",
      public_id: (req, file) => Date.now() + "-" + file.originalname,
    },
  });

  return multer({ storage });
};

export default getUploadMiddleware;
