function hasAnExercise(event) {
    if(!event) {
        return false;
    }
    
    const workoutExercises = event.extendedProps.workoutExercises;

    if(!workoutExercises || workoutExercises.length === 0) {
        return false;
    } else {
        for(const exercise of workoutExercises) {
            if(exercise.exerciseName == "" || !exercise.sets || exercise.sets <= 0 || !exercise.reps || exercise.reps <= 0 || exercise.weight == "") {
                return false;
            }
        }
    }
    return true;
}

export {hasAnExercise}