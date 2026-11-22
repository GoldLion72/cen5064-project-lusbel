
import { retrieveEvents } from "../models/progressModel.js"
import { ProgressRules } from "../domain/progress.js";

const rules = ProgressRules();

function findEvents(req, res) {
    const {startDate, endDate, exercise, metric} = req.query;

    if(!rules.areDatesValid(startDate, endDate)) {
        res.status(400).json({success: false, message: "Invalid dates.", data: {}});
        return;
    }

    const events = retrieveEvents(req.user.id, startDate, endDate, exercise, metric);

    if(events.length === 0) {
        res.status(400).json({success: false, message: "No events found.", data: {}})
        return;
    }

    const progressMade = rules.wasProgressMade(events);

    res.status(200).json({success: true, message: "Events found.", data: {progressMade, events}})
}

export {findEvents}