<script setup>
import {reactive, ref} from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import themePlugin from '@fullcalendar/vue3/themes/monarch';
import dayGridPlguin from '@fullcalendar/vue3/daygrid';
import interactionPlugin from "@fullcalendar/vue3/interaction";

import 'fullcalendar/skeleton.css';
import 'fullcalendar/themes/monarch/theme.css';
import 'fullcalendar/themes/monarch/palettes/purple.css';
import WorkoutView from './WorkoutView.vue'

const showWorkout = ref(false)
const editingWorkout = ref(null)
const selectedDate = ref(null)

const calendarOptions = reactive({
    plugins: [themePlugin, dayGridPlguin, interactionPlugin],
    initialView: "dayGridMonth",
})
</script>

<template>
    <FullCalendar :options="calendarOptions"/>
</template>