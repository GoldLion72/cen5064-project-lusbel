import db from "../db/index.js"
import { ProgressExerciseFactory } from "./ProgressExerciseFactory.js"

function retrieveEvents(startDate, endDate, exercise, metric) {
    const exerciseGetter = ProgressExerciseFactory(db, startDate, endDate, exercise, metric).createExerciseGetter();
    const exercises = exerciseGetter.getExercises();
    return exercises;
}

export {retrieveEvents}