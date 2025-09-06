import express from "express";
const router = express.Router();
import {getEventByIdController,createEventController, getAllEventsController, deleteEventController, updateEventController} from '../controller/event.js'

// Create Event API
router.post('/create-event',createEventController);
router.get("/get-all-event", getAllEventsController);
router.get("/get-event/:id", getEventByIdController);
router.delete("/delete-event/:id", deleteEventController);
router.put("/update-event/:id", updateEventController);


export default router;