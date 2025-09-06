import express from "express";
const router = express.Router();
import {getAssignedEvents,getEventRegistrations} from "../controller/guide.js"
import {requireSignIn} from "../middleware/authMiddleware.js"

// Create Event API
router.get("/assigned-events", requireSignIn, getAssignedEvents);
router.get("/event-registrations/:eventId",getEventRegistrations)


export default router;