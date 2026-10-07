import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CalendarView from '../components/CalendarView.vue'
import WorkoutView from '../components/WorkoutView.vue'

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

describe('event creation', () => {
    it('should have event modal display', async () => {
        const wrapper = mount(CalendarView);

        await wrapper.get('button[aria-label="Add Event"]').trigger('click');

        expect(wrapper.get('.modal-card-title').text()).toBe('Workout Details');
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
});

afterEach(() => {
    vi.unstubAllGlobals();
})