<script setup>
import {reactive} from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import themePlugin from '@fullcalendar/vue3/themes/monarch';
import dayGridPlugin from '@fullcalendar/vue3/daygrid';
import timeGridPlugin from '@fullcalendar/vue3/timegrid'
import listPlugin from '@fullcalendar/vue3/list'
import interactionPlugin from "@fullcalendar/vue3/interaction";

import '@fullcalendar/vue3/skeleton.css';
import '@fullcalendar/vue3/themes/monarch/theme.css';
import '@fullcalendar/vue3/themes/monarch/palettes/purple.css';
import WorkoutView from './WorkoutView.vue'
import NotificationModal from './NotificationModal.vue';
import { useEvents } from '../composables/useEvents.js';
import { useWorkoutModal } from '../composables/useWorkoutModal.js';
import { useNotification } from '../composables/useNotification.js';

const {currentEvent, showWorkout, setCurrentEvent} = useWorkoutModal();
const {notification, showNotification, setNotification} = useNotification();
const {workoutEvents, deleteEvent, saveEvent} = useEvents();

const handleSave = async (data) => {
    const returnData = await saveEvent(data);
    showWorkout.value = !returnData.ok;
    setNotification({
        notificationTitle: returnData.title,
        notificationMessage: returnData.message
    })
    showNotification.value = true;
}

const handleDelete = async (id) => {
    const returnData = await deleteEvent(id);
    showWorkout.value = !returnData.ok;
    setNotification({
        notificationTitle: returnData.title,
        notificationMessage: returnData.message
    });
    showNotification.value = true;
}

const calendarOptions = reactive({
    plugins: [themePlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    buttons: {
        addWorkout: {
            text: "Add Event",
            isPrimary: true,
            click: (mouseEvent, htmlElement) => {
                showWorkout.value = true;
            }
        }
    },
    headerToolbar: {
        left: "addWorkout prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listWeek"
    },
    selectable: true,
    initialView: "dayGridMonth",
    events: workoutEvents,
    eventClick: setCurrentEvent
})
</script>

<template>
    <WorkoutView v-if="showWorkout" 
    :show-modal="showWorkout"
    :workout-details="currentEvent"
    v-model="showWorkout"
    @save-workout="handleSave" 
    @delete-workout="handleDelete" />
    <NotificationModal :title="notification.notificationTitle" :message="notification.notificationMessage" v-model="showNotification" />
    <FullCalendar ref="calendar" :options="calendarOptions"/>
</template>