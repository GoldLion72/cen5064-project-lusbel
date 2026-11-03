import {ref} from 'vue';

export function useProgress() {
    const startDate = ref(null);
    const endDate = ref(null);
    const exercise = ref("");
    const metric = ref("");
    const workoutEvents = ref([]);

    const searchEvents = () => {
        //make fetch call here and update workoutEvents
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
        searchEvents,
        clearCriteria
    }
}