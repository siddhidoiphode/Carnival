import express from "express";
import getUploadMiddleware from "../middleware/upload.js";
import {uploadNoticeController,getAllNoticesController,deleteNoticeController} from "../controller/notice.js";
import {uploadGalleryImageController,getAllGalleryImagesController,deleteGalleryImageController} from "../controller/gallery.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// === Notice Routes ===
const noticeUpload = getUploadMiddleware("event_notices");

router.post("/upload", requireSignIn, noticeUpload.single("file"), uploadNoticeController);
router.get("/all", getAllNoticesController);

// === Gallery Routes ===
const galleryUpload = getUploadMiddleware("event_gallery");

router.post("/gallery/upload", requireSignIn, galleryUpload.single("file"), uploadGalleryImageController);
router.get("/gallery", getAllGalleryImagesController);
router.delete("/gallery/:id", requireSignIn, deleteGalleryImageController);
router.delete("/:id", requireSignIn, deleteNoticeController);

export default router;
