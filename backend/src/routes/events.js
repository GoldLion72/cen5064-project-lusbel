const express = require('express');
const router = express.Router();

const eventController = require("../controllers/eventsController");

router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventByID);
router.post('/events/:id', eventController.createEvent);

module.exports = router;
