// controllers/noticeController.js
import Notice from "../model/notice.js";
import User from "../model/user.js";
import nodemailer from "nodemailer";
import Registration from "../model/registration.js";
import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- UPLOAD NOTICE --------------------
export const uploadNoticeController = async (req, res) => {
  try {
    const { description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fileType = file.mimetype.includes("pdf") ? "pdf" : "image";

    // Get Cloudinary public_id safely
    const publicId = file.filename || file.public_id || null;
    if (!publicId) {
      return res.status(500).json({ message: "Cloudinary public_id missing" });
    }

    const newNotice = new Notice({
      uploadedBy: req.user._id,
      role: req.user.role,
      description,
      fileUrl: file.path, // secure_url from Cloudinary
      fileType,
      cloudinaryId: publicId, // <-- correct public_id saved
    });

    await newNotice.save();

    // Send Emails
    sendEmailsToUsers(newNotice);

    res.status(201).json({ message: "Notice uploaded successfully", notice: newNotice });
  } catch (err) {
    console.error("Notice upload failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- SEND EMAILS --------------------
const sendEmailsToUsers = async (notice) => {
  try {
    const approvedUsers = await User.find({ status: "approved" });
    const registrations = await Registration.find({});
    const participantEmails = [];

    registrations.forEach((reg) => {
      if (reg.type === "solo" && reg.formData?.email) {
        participantEmails.push(reg.formData.email);
      } else if (reg.type === "group" && reg.participants.length > 0) {
        reg.participants.forEach((p) => {
          if (p.email) participantEmails.push(p.email);
        });
      }
    });

    // Combine and remove duplicates
    const allEmails = [
      ...approvedUsers.map((user) => user.email),
      ...participantEmails,
    ];
    const uniqueEmails = [...new Set(allEmails)];

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await Promise.all(
      uniqueEmails.map((email) => {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "📢 New Notice Uploaded",
          text: `Dear User,

A new notice has been uploaded on the portal.

📌 Description: ${notice.description}
📁 File Type: ${notice.fileType.toUpperCase()}
🔗 File: ${notice.fileUrl}

Please visite the site to view/download the notice:
http://localhost:5173/

Regards,
Event Management Team`,
        };

        return transporter.sendMail(mailOptions);
      })
    );
  } catch (error) {
    console.error("❌ Failed to send notice emails:", error.message);
  }
};

// -------------------- GET ALL NOTICES --------------------
export const getAllNoticesController = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    console.error("Failed to get notices:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- DELETE NOTICE --------------------
export const deleteNoticeController = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Delete from Cloudinary if public_id exists
    if (notice.cloudinaryId) {
      const result = await cloudinary.uploader.destroy(notice.cloudinaryId);
    } else {
      console.warn("No cloudinaryId found for this notice");
    }

    // Delete from MongoDB
    await notice.deleteOne();

    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error("❌ Deletion failed:", err);
    res.status(500).json({ error: "Deletion failed" });
  }
};
