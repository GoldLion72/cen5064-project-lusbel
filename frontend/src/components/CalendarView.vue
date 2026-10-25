<script setup>
import {onMounted, reactive, ref, watch } from 'vue';
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

const showWorkout = ref(false)
const workoutEvents = ref([])
const showNotification = ref(false)
const notificationTitle = ref("")
const notificationMessage = ref("")

const editingWorkout = ref(null)

const createEmptyEvent = () => ({
    id: null,
    title: "",
    start: new Date().toISOString().split('T')[0],
    allDay: true,
    extendedProps: {
        workoutExercises: [{exerciseName: "", sets: 0, reps: 0, weight: ""}]
    }
})

const currentEvent = ref(createEmptyEvent())

watch(showWorkout, (newValue, oldValue) => {
    if(newValue === false && oldValue === true) {
        currentEvent.value = createEmptyEvent();
    }
})

const handleDateClick = (info) => {
    console.log(`Clicked on a date ${info.dateStr}`)
}

const handleEventClick = (info) => {
    console.log(`Clicked on event with id: ${info.event.id}`);
    console.log(`Event details: ${JSON.stringify(info.event)}`);
    currentEvent.value = info.event;
    showWorkout.value = true;
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

const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:3000/api/events/${id}`, {
        method: "DELETE"
    });

    if(!response.ok) {
        notificationTitle.value = "Failed to delete workout"
        notificationMessage.value = "Could not delete workout at this time."
        showNotification.value = true;
    } else {
        notificationTitle.value = "Deleted workout";
        notificationMessage.value = "Successfully deleted workout event.";
        showWorkout.value = false;
        showNotification.value = true;
        await getEvents();
    }
}

const handleSave = async (data) => {
    console.log("Inside handleSave");
    const eventData = {
        id: crypto.randomUUID(),
        title: "Workout - " + data.date,
        start: data.date,
        allDay: true,
        extendedProps: {
            workoutExercises: data.exercises
        }
    }

    console.log("eventData:", eventData);
    console.log("exercises:", eventData.extendedProps.workoutExercises)

    try {
        const response = await fetch("http://localhost:3000/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
        });

        if(!response.ok) {
            console.log("Response is not ok.")
            const data = await response.json();
            notificationTitle.value = "Failed to submit event."
            notificationMessage.value = data.message;
            showNotification.value = true;
            return;
        }
        
        const returnedData = await response.json();

        console.log(`returned data: ${returnedData}`);

        // if(returnedData.success) {
        //     alert("Saved event!");
        // }

        const retrievedEvent = await fetch(`http://localhost:3000/api/events/${eventData.id}`);

        if(!retrievedEvent.ok) {
            throw new Error(`Failed to get event after creation: ${retrievedEvent.status}`);

        }

        const retrievedEventData = await retrievedEvent.json();

        console.log(`retrievedEventData: ${JSON.stringify(retrievedEventData)}`);
        workoutEvents.value.push(retrievedEventData.data);
        showWorkout.value = false;
        notificationTitle.value = "Save successful";
        notificationMessage.value = "Successfully created and retrieved event.";
        showNotification.value = true;
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
    v-model="showWorkout"
    @save-workout="handleSave" 
    @delete-workout="handleDelete" />
    <NotificationModal :title="notificationTitle" :message="notificationMessage" v-model="showNotification" />
    <FullCalendar ref="calendar" :options="calendarOptions"/>
</template>