// models/notice.js
import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "guide"], required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["image", "pdf"], required: true },
    cloudinaryId: { type: String, required: true },   // <---- add this
    createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Notice", noticeSchema);
