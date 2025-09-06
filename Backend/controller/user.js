import userModel from "../model/user.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import jsonwebToken from "jsonwebtoken";
import dotenv from "dotenv";
import dns from "dns";
import util from "util";

dotenv.config();

const SECRET_KEY_ADMIN = process.env.SECRET_KEY_ADMIN;
const SECRET_KEY_GUIDE = process.env.SECRET_KEY_GUIDE;

// Function to validate email format
const isValidEmailFormat = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Function to check if email domain has MX records (meaning it can receive emails)
const checkEmailDomain = async (email) => {
  const domain = email.split("@")[1]; // Extract domain from email
  const resolveMx = util.promisify(dns.resolveMx); // Convert callback-based DNS function to a promise

  try {
    const mxRecords = await resolveMx(domain);
    return mxRecords.length > 0; // If MX records exist, domain is valid
  } catch (error) {
    return false; // Domain does not exist or is invalid
  }
};

export const registerController = async (req, res) => {
  try {
    const { name, email, password, role, secretKey } = req.body;

    // Validate common fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required" });
    }

    // Validate email format
    if (!isValidEmailFormat(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email domain exists (MX Record Check)
    const emailDomainExists = await checkEmailDomain(email);
    if (!emailDomainExists) {
      return res.status(400).json({ message: "Invalid email: Domain does not exist or cannot receive emails" });
    }

    // Additional validation for guide/admin
    if (!secretKey) {
      return res.status(400).json({ message: "Secret key is required for guide/admin registration" });
    }

    // Validate secret key for guide/admin
    if (role === "guide" && secretKey !== SECRET_KEY_GUIDE) {
      return res.status(403).json({ message: "Invalid guide secret key" });
    }
    if (role === "admin" && secretKey !== SECRET_KEY_ADMIN) {
      return res.status(403).json({ message: "Invalid admin secret key" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Define user object based on role
    let newUserData = {
      name,
      email,
      password: hashedPassword,
      role,
      status: role === "guide" ? "pending" : "approved",
    };

    // Save user to DB
    const newUser = new userModel(newUserData);
    await newUser.save();

    if (role === "guide") {
      return res.status(201).json({
        success: true,
        message: "Guide registration request sent to admin for approval.",
        newUser,
      });
    }

    res.status(201).json({ success: true, message: "User registered successfully", newUser });
  } catch (err) {
    console.error(`Error in registerController: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({ message: "Invalid email or password", success: false });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    // Check if the user is a guide and their status is "pending"
    if (user.role === "guide" && user.status === "pending") {
      return res.status(403).send({
        message: "Your request is pending approval. Please wait for admin approval.",
        success: false,
      });
    }

    // Check if the user is deleted
    if (user.status === "rejected" && user.role === "guide") {
      return res.status(403).send({
        message: "Your request has been rejected and you have been removed from the system. You cannot log in.",
        success: false,
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({ message: "Invalid password", success: false });
    }

    // Token generation
    const token = await jsonwebToken.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (err) {
    console.error(`Error in loginController: ${err}`);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};



// controller/authController.js
export const updateProfileController = async (req, res) => {
  try {
    const { name, password } = req.body;
    const userId = req.user._id; // Assuming you're using JWT middleware to attach user

    if (!name && !password) {
      return res.status(400).json({ message: "Please provide data to update." });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (password) user.password = await hashPassword(password);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error in updateProfileController:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// controller/authController.js

export const getProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      ...user._doc,
    });
  } catch (error) {
    console.error("Error in getProfileController:", error);
    res.status(500).json({ message: "Server error" });
  }
};
