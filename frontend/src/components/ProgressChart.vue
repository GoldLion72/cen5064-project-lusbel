<script setup>
import { useProgressChart } from '../composables/useProgressChart';

const props = defineProps(['eventData']);

const {chartComponent, chartType, chartOptions, chartData} = useProgressChart(() => props.eventData);
</script>

<template>
    <div class="box">
        <div class="field">
            <label class="label">Chart Type</label>
            <div class="select">
                <select v-model="chartType">
                    <option v-for="option in chartOptions" :value="option.value">{{ option.label }}</option>
                </select>
            </div>
        </div>
        <component :is="chartComponent" :event-data="chartData"></component>
    </div>
</template>