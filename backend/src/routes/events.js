const express = require('express');
const router = express.Router();

const eventController = require("../controllers/eventsController");

router.get('/events', eventController.getAllEvents);
router.post('/events', eventController.createEvent);
router.get('/events/:id', eventController.getEventByID);

module.exports = router;
