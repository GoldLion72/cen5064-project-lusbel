<script setup>
import { ref } from 'vue'

const props = defineProps(["showModal"])

const exerciseOptions = ref([
    {value: "benchPress", label: "Bench Press", category: "strength"},
    {value: "shoulderPress", label: "Shoulder Press", category: "strength"},
    {value: "bicepCurls", label: "Bicep Curls", category: "strength"},
    {value: "treadmill", label: "Treadmill", category: "cardio"}
])

const exercises = ref([{exerciseName: "", sets: 0, reps: 0, weight: ""}])
</script>

<template>
    <div class="modal" :class="{'is-active': props.showModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
            <div class="modal-card-head">
                <p class="modal-card-title">Workout Details</p>
                <button class="delete"></button>
            </div>
            <div class="modal-body">
                <p class="subtitle">Enter your exercises below.</p>
                <table class="table is-bordered is-striped">
                    <thead>
                        <tr>
                            <th>Exercise</th>
                            <th>Sets</th>
                            <th>Reps</th>
                            <th>Weight (lbs)</th>
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
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-card-footer">
                <div class="buttons">
                    <button class="button is-primary" @click="$emit('saveWorkout', exercises)">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>
