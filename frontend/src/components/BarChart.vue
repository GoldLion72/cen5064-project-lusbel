<script setup>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
import {Bar} from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps(['eventData']);

const options = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
        display: false
    }
};

</script>

<template>
    <Bar :data="eventData" :options="options">Chart could not be loaded.</Bar>
</template>