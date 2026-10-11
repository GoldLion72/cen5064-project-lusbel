<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps(["showModal", "workoutDetails"])
const emit = defineEmits(['saveWorkout'])

const id = ref(props.workoutDetails.id)
const workoutDate = ref(new Date(props.workoutDetails.start).toISOString().split('T')[0])

const exerciseOptions = ref([
    {value: "benchPress", label: "Bench Press", category: "strength"},
    {value: "shoulderPress", label: "Shoulder Press", category: "strength"},
    {value: "latPulldown", label: "Lateral Pulldown", category: "strength"},
    {value: "bicepCurls", label: "Bicep Curls", category: "strength"},
    {value: "tricepExtension", label: "Triceps Extension"},
    {value: "treadmill", label: "Treadmill", category: "cardio"}
])


const exercises = ref(props.workoutDetails.extendedProps.workoutExercises)

const addExercise = () => {
    exercises.value.push({exerciseName: "", sets: 0, reps: 0, weight: ""})
}

const sendData = () => {
    const workoutData = {
        date: workoutDate.value,
        exercises: exercises.value
    }

    emit('saveWorkout', workoutData)
}

onMounted(() => {
    console.log(`Is workoutDate a date? ${workoutDate.value instanceof Date ? "Yes" : "No"}`)
    console.log(`Workout date: ${workoutDate.value}`)
})
</script>

<template>
    <div class="modal" :class="{'is-active': props.showModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
            <div class="modal-card-head">
                <p class="modal-card-title">Workout Details</p>
                <button class="delete" @click="$emit('close-modal', false)"></button>
            </div>
            <div class="modal-card-body">
                <div class="field">
                    <label class="label">Date</label>
                    <div class="control">
                        <input type="date" class="input is-info" v-model="workoutDate"/>
                    </div>
                </div>
                <p class="subtitle">Enter your exercises below.</p>
                <table class="table is-bordered is-striped">
                    <thead>
                        <tr>
                            <th>Exercise</th>
                            <th>Sets</th>
                            <th>Reps</th>
                            <th>Weight (lbs)</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(exercise, index) in exercises" :key="index">
                            <td>
                                <div class="select is-info">
                                    <select v-model="exercise.exerciseName">
                                        <option 
                                            v-for="option in exerciseOptions" 
                                            :value="option.value"
                                        >
                                        {{ option.label }}
                                        </option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <input class="input is-info" v-model="exercise.sets" />
                            </td>
                            <td>
                                <input class="input is-info" v-model="exercise.reps" />
                            </td>
                            <td>
                                <input class="input is-info" v-model="exercise.weight" />
                            </td>
                            <td>
                                <button class="button is-danger" @click="exercises.splice(index, 1)">
                                    <span class="icon is-small">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="buttons is-right">
                    <button class="button is-info" @click="addExercise">Add Row</button>
                </div>
            </div>
            <div class="modal-card-foot">
                <div class="buttons">
                    <button class="button is-primary" @click="sendData">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>
