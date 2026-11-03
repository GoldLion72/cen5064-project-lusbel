import {ref} from 'vue';

export function useProgress() {
    const startDate = ref(null);
    const endDate = ref(null);
    const exercise = ref("");
    const metric = ref("");
    const workoutEvents = ref([]);

    const searchEvents = () => {
        //do search here
    }

    const clearCriteria = () => {
        startDate.value = null;
        endDate.value = null;
        
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