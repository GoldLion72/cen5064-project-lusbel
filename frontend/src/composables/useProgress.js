import {ref} from 'vue';

export function useProgress() {
    const startDate = ref(null);
    const endDate = ref(null);
    const exercise = ref("");
    const metric = ref("");
    const workoutEvents = ref([]);
    const madeProgress = ref(null);

    const searchEvents = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/progress?startDate=${startDate.value}&endDate=${endDate.value}&exercise=${exercise.value}&metric=${metric.value}`);
            const data = await response.json();

            if(data.success) {
                workoutEvents.value = data.data.events;
                madeProgress.value = data.data.progressMade;
            }
        } catch (error) {
            throw error;
        }
    }

    const clearCriteria = () => {
        startDate.value = null;
        endDate.value = null;
        exercise.value = "";
        metric.value = "";
    }

    return {
        startDate,
        endDate,
        exercise,
        metric,
        workoutEvents,
        madeProgress,
        searchEvents,
        clearCriteria
    }
}