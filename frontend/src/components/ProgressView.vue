<script setup>
import ProgressChart from './ProgressChart.vue';
import NotificationModal from './NotificationModal.vue';
import { useProgress } from '../composables/useProgress';
import { useNotification } from '../composables/useNotification.js';
import { watch } from 'vue';
const props = defineProps(['exerciseOptions', 'metricOptions']);

const {
    startDate,
    endDate,
    exercise,
    metric,
    workoutEvents,
    madeProgress,
    errorFound,
    error,
    searchEvents,
    clearCriteria
} = useProgress();

const {
    showNotification,
    notification,
    setNotification
} = useNotification()

watch(errorFound, (errorValue) => {
    if(errorValue) {
        setNotification({
            notificationTitle: error.title,
            notificationMessage: error.message
        });
        showNotification.value = true;
    }
});

</script>

<template>
    <NotificationModal v-if="showNotification" v-model="showNotification" :title="notification.notificationTitle" :message="notification.notificationMessage"></NotificationModal>
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
                                <option v-for="option in exerciseOptions" :value="option.value">{{ option.label }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Metric</label>
                        <div class="select is-fullwidth">
                            <select id="metricSelect" v-model="metric">
                                <option v-for="option in metricOptions" :value="option.value">{{ option.label }}</option>
                            </select>
                        </div>
                    </div>
                </div>               
            </div>
        </div>
        <div class="card-footer">
            <a id="searchBtn" class="card-footer-item" @click="searchEvents">Search</a>
            <a id="clearBtn" class="card-footer-item" @click="clearCriteria">Clear</a>
        </div>
    </div>
    <div id="progressMsg" v-if="madeProgress !== null" class="box" :class="{'has-background-primary': madeProgress, 'has-background-danger': !madeProgress}">
        {{ madeProgress ? "Progress made!" : "No progress made." }}
    </div>
    <ProgressChart v-if="workoutEvents.length > 0" :event-data="workoutEvents"></ProgressChart>
</template>
