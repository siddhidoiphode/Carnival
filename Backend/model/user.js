import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["guide", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "guide" ? "pending" : "approved";
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
