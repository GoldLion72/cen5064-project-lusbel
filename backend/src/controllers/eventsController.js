import {retrieveEvents, insertEvent, getEvent, deleteEvent} from '../models/eventsModel.js';
import { hasAnExercise } from '../domain/workout.js';

function getAllEvents(req, res){
    const events = retrieveEvents();
    if(events.length === 0) {
        res.status(200).json({success: true, message: "No events found.", data: events})
    } else {
        res.status(200).json({success: true, message: "Events were retrieved.", data: events});
    }
}

function createEvent (req, res) {
    console.log(`Incoming request body: ${JSON.stringify(req.body)}`);
    const event = req.body;
    if(!hasAnExercise(event)) {
        res.status(400).json({success: false, message: "Event is missing exercises, or exercise info.", data: {}});
        return;
    }
    insertEvent(event);
    res.status(200).json({success: true, message: "Event was created.", data: {}});
}

function getEventByID(req, res) {
    console.log(`Request parameters: ${JSON.stringify(req.params)}`);
    const eventID = req.params.id;
    const eventData = getEvent(eventID);

    res.status(200).json({success: true, message: "Retrieved event.", data: eventData});
}

function deleteEventByID(req, res) {
    console.log("Inside deleteEventByID.");
    console.log(`Request parameters: ${JSON.stringify(req.params)}`);
    const eventID = req.params.id;

    deleteEvent(eventID);
    res.status(200).json({success: true, message: "Deleted event.", data: {}});
}

export {getAllEvents, createEvent, getEventByID, deleteEventByID};

