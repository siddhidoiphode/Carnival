import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  cloudinaryId: { type: String }, // Optional if using Cloudinary
  uploadedAt: { type: Date, default: Date.now },
});

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
