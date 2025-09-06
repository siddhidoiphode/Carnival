import express from 'express';
import { sendQuery } from '../controller/contact.js'; // import the controller

const router = express.Router();

router.post('/send-query', sendQuery);

export default router;
