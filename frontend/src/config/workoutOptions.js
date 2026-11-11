const workoutOptions = {
    exerciseOptions: [
        {value: "benchPress", label: "Bench Press", category: "strength"},
        {value: "shoulderPress", label: "Shoulder Press", category: "strength"},
        {value: "latPulldown", label: "Lateral Pulldown", category: "strength"},
        {value: "bicepCurls", label: "Bicep Curls", category: "strength"},
        {value: "tricepExtension", label: "Triceps Extension"},
        {value: "treadmill", label: "Treadmill", category: "cardio"}
    ],
    metricOptions: [
        {value: "", label: "Select"},
        {value: "sets", label: "Sets"},
        {value: "reps", label: "Reps"},
        {value: "weight", label: "Weight (lbs)"}
    ]
};

for(const options of Object.values(workoutOptions)) {
    options.forEach(option => Object.freeze(option));
    Object.freeze(options);
}

Object.freeze(workoutOptions);

export {workoutOptions};