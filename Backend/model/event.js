import mongoose from "mongoose";

// Event Schema
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["solo", "group"], required: true },
  category: { type: String, required: true }, // Sports, Cultural, etc.
  guide: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Guide assigned
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  groupLimit: { type: Number, default: 0 }, // If 0, unlimited participants
  registrationFields: [
    {
      label: { type: String, required: true }, // Field Label
      type: { type: String, required: true }, // Input Type (text, dropdown, number)
      options: [String], // Options for dropdown
      required: { type: Boolean, default: true },
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
