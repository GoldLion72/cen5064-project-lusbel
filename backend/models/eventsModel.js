const db = require('../db')

function retrieveEvents() {
    const data = {};
    
    const eventSQL = "SELECT * FROM EVENT";

    const stmt = db.prepare(eventSQL);
    const events = stmt.all();

    for(const event of events) {
        data.id = event.EVENT_ID;
        data.title = event.TITLE;
        data.start = event.START_DATE;
        data.allDay = event.ALL_DAY == 1 ? true : false;
        data.extendedProps.workoutExercises = [];

        const exerciseSQL = "SELECT * FROM EVENT_EXERCISES WHERE EVENT_ID = ?";
        const stmt = db.prepare(exerciseSQL);
        const exercises = stmt.all(data.id);

        for(const exercise of exercises) {
            data.extendedProps.workoutExercises.push({
                exerciseName: exercise.EXERCISE_NAME,

            })
        }
    }

    return data;
}

function insertEvent() {

}

module.exports = {retrieveEvents, insertEvent}