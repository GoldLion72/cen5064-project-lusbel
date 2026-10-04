const {retrieveEvents, insertEvent} = require('../models/eventsModel');

function getAllEvents(req, res){
    const events = retrieveEvents();
    if(events.length === 0) {
        res.status(200).json({success: false, message: "No events found.", data: events})
    } else {
        res.status(200).json({success: true, message: "Events were retrieved.", data: events});
    }
}

function createEvent (req, res) {
    console.log(`Incoming request body: ${JSON.stringify(req.body)}`);
    const event = req.body;
    insertEvent(event);
    res.status(200).json({success: true, message: "Event was created.", data: {}});
}

module.exports = {getAllEvents, createEvent};

