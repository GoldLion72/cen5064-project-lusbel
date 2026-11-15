const workoutOptions = {
    exerciseOptions: [
        {value: "", label: "Select"},
        {value: "benchPress", label: "Bench Press"},
        {value: "shoulderPress", label: "Shoulder Press"},
        {value: "latPulldown", label: "Lateral Pulldown"},
        {value: "bicepCurls", label: "Bicep Curls"},
        {value: "tricepExtension", label: "Triceps Extension"}
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