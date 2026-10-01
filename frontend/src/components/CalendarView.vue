<script setup>
import {reactive, ref} from 'vue';
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

const showWorkout = ref(false)
const workoutEvents = ref([])
const editingWorkout = ref(null)

let eventProps = {
    id: null,
    title: "",
    start: new Date().toISOString().split('T')[0],
    allDay: true,
    extendedProps: {
        workoutExercises: [{exerciseName: "", sets: 0, reps: 0, weight: ""}]
    }
}

const handleDateClick = (info) => {
    console.log(`Clicked on a date ${info.dateStr}`)
}

const handleEventClick = (info) => {
    console.log(`Clicked on event with id: ${info.event.id}`);
    console.log(`Event details: ${JSON.stringify(info.event)}`);
    eventProps = info.event;
    showWorkout.value = true;
}

const closeModal = (value) => {
    showWorkout.value = value;
    eventProps = {
        id: null,
        title: "",
        start: new Date().toISOString().split('T')[0],
        allDay: true,
        extendedProps: {
            workoutExercises: [{exerciseName: "", sets: 0, reps: 0, weight: ""}]
        }
    }
}
const handleSave = (data) => {
    console.log(`Got the following data: ${JSON.stringify(data)}`);
    workoutEvents.value.push({
        id: crypto.randomUUID(),
        title: "Workout - " + data.date,
        start: data.date,
        allDay: true,
        extendedProps: {
            workoutExercises: data.exercises
        }
    })
    console.log(workoutEvents.value);
    showWorkout.value = false;
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
    dateClick: handleDateClick,
    eventClick: handleEventClick
})

</script>

<template>
    <WorkoutView v-if="showWorkout" 
    :show-modal="showWorkout"
    :workout-details="eventProps"
    @save-workout="handleSave" 
    @close-modal="closeModal" />
    <FullCalendar ref="calendar" :options="calendarOptions"/>
</template>