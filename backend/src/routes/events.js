import express from 'express';
const router = express.Router();

import {getAllEvents, createEvent, getEventByID, deleteEventByID} from "../controllers/eventsController.js";

router.get('/events', getAllEvents);
router.post('/events', createEvent);
router.get('/events/:id', getEventByID);
router.delete('/events/:id', deleteEventByID);

export default router;
