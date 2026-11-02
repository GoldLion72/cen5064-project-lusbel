import {ref, onMounted, toValue} from 'vue'

export function useEvents(showWorkout, showNotification, setNotification) {
    const workoutEvents = ref([]);

    const getEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/events');
            if(response.ok) {
                const result = await response.json();
                if(result.success) {
                    workoutEvents.value = result.data;
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const deleteEvent = async (id) => {
        const returnData = {
            ok: false,
            title: "",
            message: ""
        };

        const eventID = toValue(id);
        if(!eventID) return;
        
        try {
            const response = await fetch(`http://localhost:3000/api/events/${eventID}`, {
                method: "DELETE"
            });
    
            if(!response.ok) {
                returnData.ok = false;
                returnData.title = "Failed to delete workout";
                returnData.message = "Could not delete workout at this time.";
            } else {
                returnData.ok = true;
                returnData.title= "Deleted workout";
                returnData.message = "Successfully deleted workout event.";
                await getEvents();
            }
        } catch (error) {
            throw error;
        }

        return returnData;
    }

    const retrieveEvent = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/events/${id}`);

            if(!response.ok) {
                throw new Error("Failed to get event.");
            }

            const result = await response.json();

            workoutEvents.value.push(result.data);
        } catch (error) {
            throw error;
        }
    }

    const saveEvent = async (data) => {
        const returnData = {
            ok: false,
            title: "",
            message: ""
        }

        const eventData = {
            id: crypto.randomUUID(),
            title: "Workout - " + data.date,
            start: data.date,
            allDay: true,
            extendedProps: {
                workoutExercises: data.exercises
            }
        }
        
        try {
            const response = await fetch("http://localhost:3000/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(eventData)
            });

            if(!response.ok) {
                const data = await response.json();
                returnData.ok = false;
                returnData.title = "Failed to submit event.";
                returnData.message = data.message;
                return returnData;
            }

            await retrieveEvent(eventData.id);

            returnData.ok = true;
            returnData.title = "Save successful";
            returnData.message = "Successfully created and retrieved event.";
        } catch (error) {
            returnData.ok = false;
            returnData.title = "Failed to retrieve event."
            returnData.message = error.message === "Failed to get event." 
            ? "Submission succeeded, but event could not be retrieved at this time." 
            : "Something went wrong when attempting to submit and retrieve event.";
        }

        return returnData;
    }

    onMounted(async () => {
        await getEvents();
    });

    return {workoutEvents, deleteEvent, saveEvent};
}