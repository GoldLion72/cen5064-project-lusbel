import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CalendarView from '../components/CalendarView.vue'
import WorkoutView from '../components/WorkoutView.vue'



// afterEach(() => {
//     vi.unstubAllGlobals();
//     vi.resetAllMocks();
// })
beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async (url, options = {}) => ({
        ok: true,
        status: 200,
        json: async () => ({
            success: true,
            message: "Retrived event.",
            data: options.method === 'POST' ? JSON.parse(options.body) : []
        })
    })));
})

afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
})

describe('event creation', () => {
    // beforeEach(() => {
    //     vi.stubGlobal('fetch', vi.fn(async (url, options = {}) => ({
    //         ok: true,
    //         status: 200,
    //         json: async () => ({
    //             success: true,
    //             message: "Retrived event.",
    //             data: options.method === 'POST' ? JSON.parse(options.body) : []
    //         })
    //     })));
    // })

    // afterEach(() => {
    //     vi.unstubAllGlobals();
    //     vi.resetAllMocks();
    // })

    it('should have event modal display', async () => {
        const wrapper = mount(CalendarView);

        await wrapper.get('button[aria-label="Add Event"]').trigger('click');

        const workoutModal = wrapper.getComponent({name: 'WorkoutView'});

        expect(workoutModal.classes()).toContain('is-active');
    });

    it('should submit event and retrieve an event', async () => {
        const dummyData = {
            id:"3e2bc59f-24db-4229-a658-3a19eba524da",
            title:"Workout - 2026-10-06",
            start:"2026-10-06",
            allDay:true,
            extendedProps:{
                workoutExercises:[{"exerciseName":"benchPress","sets":5,"reps":4,"weight":205}]
            }
        }

        const wrapper = mount(CalendarView);

        const initialWorkoutEvents = [...wrapper.vm.workoutEvents];
        const initialEventsLength = initialWorkoutEvents.length;

        await wrapper.get('button[aria-label="Add Event"]').trigger('click');

        const workoutWrapper = wrapper.findComponent(WorkoutView);

        expect(workoutWrapper).toBeTruthy();

        const today = new Date().toISOString().split('T')[0];
        const exerciseList = [{exerciseName: "benchPress", sets: 5, reps: 4, weight: 205}];
        workoutWrapper.setData({workoutDate: today, exercises: exerciseList});

        expect(workoutWrapper.vm.workoutDate).toBe(today);
        expect(workoutWrapper.vm.exercises).toEqual(exerciseList);

        await workoutWrapper.get('.button.is-primary').trigger('click');
        await flushPromises();
        expect(wrapper.vm.workoutEvents).toHaveLength(initialEventsLength + 1);
    });

    it('should display events that are stored on mount', async () => {
        const wrapper = mount(CalendarView)

        const dummyData = 
                [
                    {
                        id:"3e2bc59f-24db-4229-a658-3a19eba524da",
                        title:"Workout - 2026-10-06",
                        start:"2026-10-06",
                        allDay:true,
                        extendedProps:{
                            workoutExercises:[{"exerciseName":"benchPress","sets":5,"reps":4,"weight":205}]
                        },
                        id:"e456bec6-0da5-4024-bfb0-1a2bcebf9ec6",
                        title:"Workout - 2026-10-05",
                        start:"2026-10-05",
                        allDay: true,
                        extendedProps:{
                            workoutExercises:[{"exerciseName":"benchPress","sets":5,"reps":4,"weight":205}]
                        },
                    }
                ];

        globalThis.fetch = vi.fn().mockResolvedValue({
            status: 200,
            ok: true,
            json: async () => ({
                success: true,
                message: "Retrieved events.",
                data: dummyData
            })
        });

        await wrapper.vm.getEvents();

        expect(wrapper.vm.workoutEvents).toEqual(dummyData);
    });

    it('should display error on submit when no exercises are present', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            status: 400,
            ok: false,
            json: () => ({
                success: false,
                message: "Event is missing exercises, or exercise info.",
                data: {}
            })
        })

        const wrapper = mount(CalendarView);

        // console.log("workoutEvents:", wrapper.vm.workoutEvents);
        await wrapper.get('button[aria-label="Add Event"]').trigger('click');

        const workoutModal = wrapper.getComponent({name: 'WorkoutView'});

        expect(workoutModal.classes()).toContain('is-active');

        await workoutModal.get("#saveBtn").trigger('click');

        expect(wrapper.vm.showNotification).toBe(true);
    })
});

describe('event deletion', () => {
    it('should not display the delete button on new event', async () => {
        const wrapper = mount(CalendarView);

        await wrapper.get('button[aria-label="Add Event"]').trigger('click');

        expect(() => wrapper.get('#deleteBtn')).toThrow();
    });

    it('should display the delete button in an existing event.', async () => {
        const wrapper = mount(CalendarView);
        const randomID = crypto.randomUUID();

        const dummyData = {
            event: {
                id: randomID,
                title: "Workout - 2026-10-21",
                start: "10/21/2026",
                allDay: true,
                extendedProps: {
                    workoutExercises: [{
                        exerciseName: "brenchPress",
                        sets: 5,
                        reps: 5,
                        weight: 210
                    }]
                }
            }
        }

        await wrapper.getComponent({ref: "calendar"}).props('options').eventClick(dummyData);

        expect(wrapper.vm.currentEvent).toEqual(dummyData.event);

        const button = wrapper.get('#deleteBtn');

        expect(button.text()).toBe('Delete');
    });

    it('should remove the event upon deletion', async () => {
        const randomID = crypto.randomUUID();

        let dummyGetData = [
            {
                id: crypto.randomUUID(),
                title: "Workout - Test One",
                start: "10/19/2026",
                allDay: true,
                extendedProps: {
                    workoutExercises: [
                        {
                            exerciseName: "benchPress",
                            sets: 5,
                            reps: 5,
                            weight: 210
                        }
                    ]
                }
            },
            {
                id: randomID,
                title: "Workout - Test Two",
                start: "10/20/2026",
                allDay: true,
                extendedProps: {
                    workoutExercises: [
                        {
                            exerciseName: "shoulderPress",
                            sets: 5,
                            reps: 10,
                            weight: 60
                        }
                    ]
                }
            }        
        ];

        const eventIDToRemove = dummyGetData[0].id;

        const expectedDataAfterDelete = [
            {
                id: randomID,
                title: "Workout - Test Two",
                start: "10/20/2026",
                allDay: true,
                extendedProps: {
                    workoutExercises: [
                        {
                            exerciseName: "shoulderPress",
                            sets: 5,
                            reps: 10,
                            weight: 60
                        }
                    ]
                }
            }  
        ]

        globalThis.fetch = vi.fn((url, options = {}) => {
            if(url === "http://localhost:3000/api/events" && (!options.method || options.method === "GET")) {
                return {
                    status: 200,
                    ok: true,
                    json: () => ({
                        success: true,
                        message: "Events were retrieved.",
                        data: dummyGetData
                    })
                }
            } else if(url === `http://localhost:3000/api/events/${eventIDToRemove}` && options.method === "DELETE") {
                dummyGetData = dummyGetData.filter(event => event.id !== eventIDToRemove);
                return {
                    status: 200,
                    ok: true
                }
            }
        })
        
        const wrapper = mount(CalendarView);
        await flushPromises();

        expect(wrapper.vm.workoutEvents).toEqual(dummyGetData);

        await wrapper.vm.handleDelete(eventIDToRemove);
        await flushPromises();

        expect(wrapper.vm.workoutEvents).toEqual(expectedDataAfterDelete);
    });

    it('should display error message on failure', async () => {
        let dummyGetData = [
            {
                id: crypto.randomUUID(),
                title: "Workout - Test One",
                start: "10/19/2026",
                allDay: true,
                extendedProps: {
                    workoutExercises: [
                        {
                            exerciseName: "benchPress",
                            sets: 5,
                            reps: 5,
                            weight: 210
                        }
                    ]
                }
            },
            {
                id: crypto.randomUUID(),
                title: "Workout - Test Two",
                start: "10/20/2026",
                allDay: true,
                extendedProps: {
                    workoutExercises: [
                        {
                            exerciseName: "shoulderPress",
                            sets: 5,
                            reps: 10,
                            weight: 60
                        }
                    ]
                }
            }        
        ];

        const eventIDToRemove = dummyGetData[0].id;

        globalThis.fetch = vi.fn((url, options = {}) => {
            if(url === "http://localhost:3000/api/events" && (!options.method || options.method === "GET")) {
                return {
                    status: 200,
                    ok: true,
                    json: () => ({
                        success: true,
                        message: "Events were retrieved.",
                        data: dummyGetData
                    })
                }
            } else if(url === `http://localhost:3000/api/events/${eventIDToRemove}` && options.method === "DELETE") {
                return {
                    status: 500,
                    ok: false
                }
            }
        });

        const wrapper = mount(CalendarView);
        await flushPromises();

        expect(wrapper.vm.workoutEvents).toEqual(dummyGetData);

        await wrapper.vm.handleDelete(eventIDToRemove);
        await flushPromises();

        expect(wrapper.vm.showNotification).toBe(true);
        expect(wrapper.vm.notificationTitle).toBe('Failed to delete workout');
    });
})