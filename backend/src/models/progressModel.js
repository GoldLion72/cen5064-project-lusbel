import db from "../db/index.js"
import { ProgressExerciseFactory } from "./ProgressExerciseFactory.js"

function retrieveEvents(userID, startDate, endDate, exercise, metric) {
    const exerciseGetter = ProgressExerciseFactory(db, userID, startDate, endDate, exercise, metric).createExerciseGetter();
    const exercises = exerciseGetter.getExercises();
    return exercises;
}

export {retrieveEvents}
