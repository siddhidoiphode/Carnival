import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  type: { type: String, enum: ["solo", "group"], required: true },
  formData: { type: mongoose.Schema.Types.Mixed }, // Dynamic fields for solo events
  teamName: { type: String }, // Only for group events
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String, required: true },
      rollNumber: { type: Number, required: true }, // Added roll number
      mobileNumber: { type: Number, required: true }, // Added mobile number
      year: { type: String, required: true },
      branch: { type: String, required: true },
      division: { type: String, required: true },
      email: { type: String, required: true },
    },
  ],
  registeredAt: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;
