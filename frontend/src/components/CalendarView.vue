<script setup>
import {onMounted, reactive, ref} from 'vue';
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

let currentEvent = {
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
    currentEvent = info.event;
    showWorkout.value = true;
}

const closeModal = (value) => {
    showWorkout.value = value;
    currentEvent = {
        id: null,
        title: "",
        start: new Date().toISOString().split('T')[0],
        allDay: true,
        extendedProps: {
            workoutExercises: [{exerciseName: "", sets: 0, reps: 0, weight: ""}]
        }
    }
}

const getEvents = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/events');
        if(response.ok) {
            const result = await response.json();
            if(!result.success) {
                alert("Could not retrieve events at this time.");
            }
            workoutEvents.value = result.data;
        } else {
            alert("Could not retrieve events at this time.");
        }
    } catch (error) {
        alert("Could not retrieve events at this time.")
        console.error(error);
    }
}

const handleSave = async (data) => {
    const eventData = {
        id: crypto.randomUUID(),
        title: "Workout - " + data.date,
        start: data.date,
        allDay: true,
        extendedProps: {
            workoutExercises: data.exercises
        }
    }

    // workoutEvents.value.push(eventData);
    // console.log(workoutEvents.value);
    showWorkout.value = false;

    try {
        const response = await fetch("http://localhost:3000/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
        });

        if(!response.ok) {
            alert("Unable to save event at this time.");
            throw new Error(`Response status: ${response.status}`)
        }
        
        const returnedData = await response.json();

        console.log(`returned data: ${returnedData}`);

        if(returnedData.success) {
            alert("Saved event!");
        }

        const retrievedEvent = await fetch(`http://localhost:3000/api/events/${eventData.id}`);

        if(!retrievedEvent.ok) {
            throw new Error(`Failed to get event after creation: ${retrievedEvent.status}`);
        }

        const retrievedEventData = await retrievedEvent.json();

        console.log(`retrievedEventData: ${JSON.stringify(retrievedEventData)}`);
        workoutEvents.value.push(retrievedEventData.data);
    } catch (error) {
        alert("Unable to save event at this time.");
        console.error(error);
    }
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

onMounted(() => {
    getEvents();
})
</script>

<template>
    <WorkoutView v-if="showWorkout" 
    :show-modal="showWorkout"
    :workout-details="currentEvent"
    @save-workout="handleSave" 
    @close-modal="closeModal" />
    <FullCalendar ref="calendar" :options="calendarOptions"/>
</template>