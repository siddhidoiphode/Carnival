import Gallery from "../model/gallery.js";
import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;

// @desc Upload image to gallery
export const uploadGalleryImageController = async (req, res) => {
    try {
        const file = req.file;
        if (!file || !file.path) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const newImage = new Gallery({
            imageUrl: file.path, 
            cloudinaryId: file.filename || file.originalname, // optional, used for deletion
        });

        await newImage.save();
        res.status(201).json({ message: "Image uploaded successfully", image: newImage });
    } catch (err) {
        console.error("Gallery upload error:", err);
        res.status(500).json({ message: "Image upload failed" });
    }
};

// @desc Get all gallery images
export const getAllGalleryImagesController = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json(images);
    } catch (err) {
        console.error("Fetch images error:", err);
        res.status(500).json({ message: "Failed to fetch images" });
    }
};

// @desc Delete image from gallery
export const deleteGalleryImageController = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        if (image.cloudinaryId) {
            await cloudinary.uploader.destroy(image.cloudinaryId); // ✅ fixed line
        }

        await image.deleteOne();
        res.status(200).json({ message: "Image deleted successfully" });
    } catch (err) {
        console.error("Delete image error:", err.message);
        res.status(500).json({ message: "Failed to delete image" });
    }
};

