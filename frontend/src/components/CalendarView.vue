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
const editingWorkout = ref(null)
const selectedDate = ref(null)

const handleDateClick = (info) => {
    console.log(`Clicked on a date ${info.dateStr}`)
}

const calendarOptions = reactive({
    plugins: [themePlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    buttons: {
        addWorkout: {
            text: "Add Event",
            isPrimary: true,
            click: (mouseEvent, htmlElement) => {
                console.log("Clicked on add event!");
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
    dateClick: handleDateClick
})

</script>

<template>
    <FullCalendar ref="calendar" :options="calendarOptions"/>
</template>