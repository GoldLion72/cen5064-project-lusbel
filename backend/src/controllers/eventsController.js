import {retrieveEvents, insertEvent, getEvent} from '../models/eventsModel';

function getAllEvents(req, res){
    const events = retrieveEvents();
    if(events.length === 0) {
        res.status(400).json({success: false, message: "No events found.", data: events})
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

function getEventByID(req, res) {
    console.log(`Request parameters: ${JSON.stringify(req.params)}`);
    const eventID = req.params.id;
    const eventData = getEvent(eventID);

    res.status(200).json({success: true, message: "Retrieved event.", data: eventData});
}

export {getAllEvents, createEvent, getEventByID};

