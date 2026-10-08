const express = require('express');
const router = express.Router();

import {getAllEvents, createEvent, getEventByID} from "../controllers/eventsController";

router.get('/events', getAllEvents);
router.post('/events', createEvent);
router.get('/events/:id', getEventByID);

export default router;
