import {reactive, ref} from 'vue';

export function useProgress() {
    const createEmptyError = () => ({
        title: "",
        message: ""
    });

    const startDate = ref(null);

    const endDate = ref(null);

    const exercise = ref("");
    
    const metric = ref("");

    const workoutEvents = ref([]);

    const madeProgress = ref(null);

    const errorFound = ref(false);

    const error = reactive(createEmptyError());

    const searchEvents = async () => {
        try {
            workoutEvents.value = [];
            madeProgress.value = null;
            errorFound.value = false;
            Object.assign(error, createEmptyError());

            const response = await fetch(`http://localhost:3000/api/progress?startDate=${startDate.value}&endDate=${endDate.value}&exercise=${exercise.value}&metric=${metric.value}`);
            const data = await response.json();
            if(response.ok) {
                if(data.success) {
                    workoutEvents.value = data.data.events;
                    madeProgress.value = data.data.progressMade;
                } else {
                    errorFound.value = true;

                    Object.assign(error, {
                        title: "Search failed",
                        message: data.message
                    });
                }
            } else {
                errorFound.value = true;

                Object.assign(error, {
                    title: "Search failed",
                    message: data.message
                });
            }
        } catch (err) {
            errorFound.value = true;

            Object.assign(error, {
                title: "Search failed",
                message: "Something went wrong, and events could not be searched at this time."
            });

            throw err;
        }
    }

    const clearCriteria = () => {
        startDate.value = null;
        endDate.value = null;
        exercise.value = "";
        metric.value = "";
        workoutEvents.value = [];
        madeProgress.value = null;
    }

    return {
        startDate,
        endDate,
        exercise,
        metric,
        workoutEvents,
        madeProgress,
        errorFound,
        error,
        searchEvents,
        clearCriteria
    }
}