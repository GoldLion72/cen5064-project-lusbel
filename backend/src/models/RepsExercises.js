function RepsExercises(db, startDate, endDate, exercise) {
    const getExercises = () => {
        const sql = `
        SELECT A.START_DATE AS DATE, B.EXERCISE_REPS AS VALUE
        FROM EVENT A
        INNER JOIN EVENT_EXERCISES B ON A.EVENT_ID = B.EVENT_ID
        WHERE EXERCISE_NAME = ?
        AND START_DATE BETWEEN ? AND ?;
        `

        const preparedSQL = db.prepare(sql);
        const exercises = preparedSQL.all(exercise, startDate, endDate);

        return exercises;
    }

    return {getExercises}
}

export {RepsExercises}