<script setup>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    elements
} from 'chart.js';
import {Line} from 'vue-chartjs';

const props = defineProps(['eventData']);

const options = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
        display: false
    }
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
</script>

<template>
    <Line :data="eventData" :options="options">Chart could not be loaded.</Line>
</template>