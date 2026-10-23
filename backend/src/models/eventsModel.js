import db from '../db/index.js';
import { wasDeleted } from '../domain/workout.js';

function retrieveEvents() {
    const data = [];

    const eventSQL = "SELECT * FROM EVENT";

    const stmt = db.prepare(eventSQL);
    const events = stmt.all();

    for(const event of events) {
        const eventData = {
            id: "",
            title: "",
            start: "",
            allDay: "",
            extendedProps: {
                workoutExercises: []
            }
        };

        eventData.id = event.EVENT_ID;
        eventData.title = event.TITLE;
        eventData.start = event.START_DATE;
        eventData.allDay = event.ALL_DAY == 1 ? true : false;

        const exerciseSQL = "SELECT * FROM EVENT_EXERCISES WHERE EVENT_ID = ?";
        const stmt = db.prepare(exerciseSQL);
        const exercises = stmt.all(eventData.id);

        for(const exercise of exercises) {
            eventData.extendedProps.workoutExercises.push({
                exerciseName: exercise.EXERCISE_NAME,
                sets: exercise.EXERCISE_SETS,
                reps: exercise.EXERCISE_REPS,
                weight: exercise.EXERCISE_WEIGHT
            });
        }
        data.push(eventData);
    }

    return data;
}

function insertEvent(event) {
    console.log(`Inside insertEvent`);
    console.log(event);
    const eventID = event.id;
    const allDay = event.allDay === true ? 1 : 0;
    const workoutExercises = event.extendedProps.workoutExercises;

    console.log(`Workout exercises value: ${JSON.stringify(workoutExercises)}`);
    
    const eventStmt = db.prepare("INSERT INTO EVENT (EVENT_ID, TITLE, START_DATE, ALL_DAY) VALUES (?, ?, ?, ?)");
    const eventInfo = eventStmt.run(eventID, event.title, event.start, allDay);

    console.log(`Made the following number of changes: ${eventInfo.changes}`);

    const exerciseStmt = db.prepare("INSERT INTO EVENT_EXERCISES (EVENT_ID, EXERCISE_NAME, EXERCISE_SETS, EXERCISE_REPS, EXERCISE_WEIGHT) VALUES (?, ?, ?, ?, ?)");
    
    try {
        const insertExercises = db.transaction((exercises) => {
            for(const exercise of exercises) {
                exerciseStmt.run(eventID, exercise.exerciseName, exercise.sets, exercise.reps, exercise.weight)
            }
        });
        insertExercises(workoutExercises);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function getEvent(eventID) {
    console.log(`Event ID: ${eventID}`);
    const eventData = {
        id: "",
        title: "",
        start: "",
        allDay: "",
        extendedProps: {
            workoutExercises: []
        }
    }

    const eventStmt = db.prepare("SELECT * FROM EVENT WHERE EVENT_ID = ?;");
    const eventInfo = eventStmt.get(eventID);

    eventData.id = eventInfo.EVENT_ID;
    eventData.title = eventInfo.TITLE;
    eventData.start = eventInfo.START_DATE;
    eventData.allDay = eventInfo.ALL_DAY == 1 ? true : false;

    const exercisesStmt = db.prepare("SELECT * FROM EVENT_EXERCISES WHERE EVENT_ID = ?;");
    const exercisesInfo = exercisesStmt.all(eventID);

    for(const exercise of exercisesInfo) {
        eventData.extendedProps.workoutExercises.push({
            exerciseName: exercise.EXERCISE_NAME,
            sets: exercise.EXERCISE_SETS,
            reps: exercise.EXERCISE_REPS,
            weight: exercise.EXERCISE_WEIGHT
        });
    }

    return eventData;
}

function deleteEvent(id) {
    console.log("Inside delete event. Working with id:", id);
    try {
        const deleteExercisesStmt = db.prepare("DELETE FROM EVENT_EXERCISES WHERE EVENT_ID = ?;");
        const exercisesInfo = deleteExercisesStmt.run(id);
        console.log(`Changes made to the exercises table: ${exercisesInfo.changes}`);
        
        const deleteEventStmt = db.prepare("DELETE FROM EVENT WHERE EVENT_ID = ?;");
        const eventInfo = deleteEventStmt.run(id);
        console.log(`Changes made to the event table: ${eventInfo.changes}`);
        
        if(!wasDeleted(exercisesInfo.changes) || !wasDeleted(eventInfo.changes)) {
            throw new Error("Deletion failed.")
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export {retrieveEvents, insertEvent, getEvent, deleteEvent};