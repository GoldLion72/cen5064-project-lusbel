import {ref, toValue, watch} from 'vue';

export function useWorkoutModal() {
    const createEmptyEvent = () => {
        return {
            id: null,
            title: "",
            start: new Date().toISOString().split('T')[0],
            allDay: true,
            extendedProps: {
                workoutExercises: [{exerciseName: "", sets: 0, reps: 0, weight: ""}]
            }
        }
    }

    const currentEvent = ref(createEmptyEvent());
    const showWorkout = ref(false);

    const setCurrentEvent = (info) => {
        currentEvent.value = createEmptyEvent();
        const {event} = toValue(info);
        currentEvent.value = event;
        showWorkout.value = true;
    }

    watch(showWorkout, (newValue, oldValue) => {
        if(newValue === false && oldValue === true) {
            currentEvent.value = createEmptyEvent();
        }
    })

    return {currentEvent, showWorkout, setCurrentEvent}
    
}