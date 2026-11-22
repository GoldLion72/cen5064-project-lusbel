import {retrieveEvents, insertEvent, getEvent, deleteEvent, isDateAlreadyUsed} from '../models/eventsModel.js';
import { hasAnExercise } from '../domain/workout.js';

// req.user is set by the requireAuth middleware.

function getAllEvents(req, res){
    const events = retrieveEvents(req.user.id);
    if(events.length === 0) {
        res.status(200).json({success: true, message: "No events found.", data: events})
    } else {
        res.status(200).json({success: true, message: "Events were retrieved.", data: events});
    }
}

function createEvent (req, res) {
    const userID = req.user.id;
    const event = req.body;
    const eventDate = event.start;
    if(isDateAlreadyUsed(userID, eventDate)) {
        res.status(400).json({success: false, message: `There is already an event on ${eventDate}.`, data: {}});
        return;
    }
    if(!hasAnExercise(event)) {
        res.status(400).json({success: false, message: "Event is missing exercises, or exercise info.", data: {}});
        return;
    }
    insertEvent(userID, event);
    res.status(200).json({success: true, message: "Event was created.", data: {}});
}

function getEventByID(req, res) {
    const eventID = req.params.id;
    const eventData = getEvent(req.user.id, eventID);

    if(!eventData) {
        res.status(404).json({success: false, message: "Event not found.", data: {}});
        return;
    }

    res.status(200).json({success: true, message: "Retrieved event.", data: eventData});
}

function deleteEventByID(req, res) {
    const eventID = req.params.id;

    deleteEvent(req.user.id, eventID);
    res.status(200).json({success: true, message: "Deleted event.", data: {}});
}

export {getAllEvents, createEvent, getEventByID, deleteEventByID};
