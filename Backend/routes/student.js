import express from "express";
import { ongoingEvents,registerEvent,allEvents, } from "../controller/student.js";


const router = express.Router();

// GET Ongoing Events (where registration is open)
router.get("/ongoing", ongoingEvents);
router.get("/all", allEvents);
router.post("/registerEvent", registerEvent);

export default router;
