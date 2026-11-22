import { SetsExercises } from "./SetsExercises.js";
import { RepsExercises } from "./RepsExercises.js";
import { WeightExercises } from "./WeightExercises.js";

function ProgressExerciseFactory(db, userID, startDate, endDate, exercise, metric) {

    const createExerciseGetter = () => {
        switch (metric) {
            case "sets":
                return SetsExercises(db, userID, startDate, endDate, exercise);
            case "reps":
                return RepsExercises(db, userID, startDate, endDate, exercise);
            case "weight":
                return WeightExercises(db, userID, startDate, endDate, exercise);
            default:
                throw new Error("Unsupported metric found.");
        }
    }

    return {createExerciseGetter}

}

export {ProgressExerciseFactory}
