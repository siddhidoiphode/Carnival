import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import {pendingGuides,approveGuide,listOfPendingguides} from "../controller/admin.js";

const router = express.Router();

// Route to get all pending guide requests (Only for Admin)
router.get("/pending-guides", requireSignIn,pendingGuides);

// Route for approve perticular guide
router.put("/approve-guide/:id", requireSignIn,approveGuide);

// get guides whose are approved
router.get("/approved-guides",requireSignIn,listOfPendingguides);

export default router;
