<script setup>
import { useProgress } from '../composables/useProgress';

const {
    startDate,
    endDate,
    exercise,
    metric,
    workoutEvents,
    searchEvents,
    clearCriteria
} = useProgress();

</script>

<template>
    <div class="card">
        <div class="card-header">
            <p class="card-header-title">Criteria</p>
        </div>
        <div class="card-content">
            <div class="columns is-multiline">
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Start</label>
                        <div class="control">
                            <input id="startDate" class="input" type="date" v-model="startDate" />
                        </div>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="field">
                        <label class="label">End</label>
                        <div class="control">
                            <input id="endDate" class="input" type="date" v-model="endDate" />
                        </div>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Exercise</label>
                        <div class="select is-fullwidth">
                            <select id="exerciseSelect" v-model="exercise">
                                <option value="">Select</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Metric</label>
                        <div class="select is-fullwidth">
                            <select id="metricSelect" v-model="metric">
                                <option value="">Select</option>
                            </select>
                        </div>
                    </div>
                </div>               
            </div>
        </div>
        <div class="card-footer">
            <a class="card-footer-item" @click="searchEvents">Search</a>
            <a class="card-footer-item" @click="clearCriteria">Clear</a>
        </div>
    </div>
</template>
