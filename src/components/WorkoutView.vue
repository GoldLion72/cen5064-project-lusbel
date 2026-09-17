<script setup>
import { ref } from 'vue'

const exerciseOptions = ref([
    {value: "benchPress", label: "Bench Press", category: "strength"},
    {value: "shoulderPress", label: "Shoulder Press", category: "strength"},
    {value: "bicepCurls", label: "Bicep Curls", category: "strength"},
    {value: "treadmill", label: "Treadmill", category: "cardio"}
])

const exercises = ref([{exerciseName: "", sets: 0, reps: 0, duration: ""}])
</script>

<template>
    <div class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <div class="modal-card-head">
                <p class="modal-card-title">Workout Details</p>
                <button class="delete"></button>
            </div>
            <div class="modal-body">
                <p>Enter your exercises below.</p>
                <table class="table is-bordered is-striped">
                    <thead>
                        <tr>
                            <th>Exercise</th>
                            <th>Sets</th>
                            <th>Reps</th>
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
