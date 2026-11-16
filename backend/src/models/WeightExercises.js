function WeightExercises(db, startDate, endDate, exercise) {
    const getExercises = () => {
        const sql = `
        SELECT A.START_DATE AS DATE, B.EXERCISE_WEIGHT AS VALUE
        FROM EVENT A
        INNER JOIN EVENT_EXERCISES B ON A.EVENT_ID = B.EVENT_ID
        WHERE B.EXERCISE_NAME = ?
        AND A.START_DATE BETWEEN ? AND ?
        ORDER BY A.START_DATE ASC;
        `

        const preparedSQL = db.prepare(sql);
        const exercises = preparedSQL.all(exercise, startDate, endDate);

        return exercises;
    }

    return {getExercises}
}

export {WeightExercises}