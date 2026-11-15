import { SetsExercises } from "./SetsExercises.js";
import { RepsExercises } from "./RepsExercises.js";
import { WeightExercises } from "./WeightExercises.js";

function ProgressExerciseFactory(db, startDate, endDate, exercise, metric) {
    
    const createExerciseGetter = () => {
        switch (metric) {
            case "sets":
                return SetsExercises(db, startDate, endDate, exercise);
            case "reps":
                return RepsExercises(db, startDate, endDate, exercise);
            case "weight":
                return WeightExercises(db, startDate, endDate, exercise);
            default:
                throw new Error("Unsupported metric found.");
        }
    }

    return {createExerciseGetter}
    
}

export {ProgressExerciseFactory}