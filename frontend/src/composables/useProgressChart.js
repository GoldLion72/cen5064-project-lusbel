import {computed, ref, shallowRef, watch, toValue} from 'vue';
import BarChart from '../components/BarChart.vue';
import LineChart from '../components/LineChart.vue';

function useProgressChart(eventData) {
    const chartOptions = [
        {value: "bar", label: "Bar"},
        {value: "line", label: "Line"}
    ];

    const componentMap = {
        "bar": BarChart,
        "line": LineChart
    };

    const chartType = ref("bar");
    const chartComponent = shallowRef(BarChart);

    const labels = computed(() => toValue(eventData).map(event => event.DATE));
    const datasets = computed(() => [{
        label: "Event Metric Value", 
        data: toValue(eventData).map(event => event.VALUE),
        backgroundColor: "#2768F5"
    }]);

    const chartData = computed(() => ({labels: labels.value, datasets: datasets.value}));

    watch(chartType, (type) => {
        chartComponent.value = componentMap[type]
    })

    return {chartComponent, chartType, chartOptions, chartData}
}

export {useProgressChart}