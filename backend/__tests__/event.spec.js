vi.mock(import('../src/models/eventsModel'), async (importOriginal) => {
    const originalModule = await importOriginal();
    return {
        ...originalModule,
        retrieveEvents: vi.fn(),
        getEvent: vi.fn(),
    }
    
})
import request from 'supertest';
import app from '../src/app';
import {retrieveEvents, getEvent} from '../src/models/eventsModel';
import {describe, it, expect, vi, afterEach} from 'vitest';

const testID = crypto.randomUUID();
afterEach(() => {
    vi.clearAllMocks();
});

describe('GET /api/events', () => {
    it('returns JSON', async () => {
        retrieveEvents.mockReturnValue([]);

        const response = await request(app).get('/api/events');
        
        expect(response.status).toBe(200);
        
        expect(response.headers['content-type']).toContain('application/json');
    });

    it('returns event data', async () => {
        retrieveEvents.mockReturnValue([
                {
                    id: testID, 
                    title: "Workout - 10/07/2026", 
                    start: "2026-10-07", 
                    allDay: true, 
                    extendedProps: {
                        workoutExercises:[{exerciseName: "benchPress", sets: 5, reps: 5, weight: 205}]
                    }
                }
            ]
        )
        const response = await request(app).get('/api/events');
        
        expect(retrieveEvents).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length > 0).toBe(true);

    })

    it('is considered successful if no events are returned.', async () => {
        retrieveEvents.mockReturnValue([]);

        const response = await request(app).get('/api/events');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("No events found.");
    });
});

describe('GET /api/event/:id', () => {
    it('returns event matching given ID', async () => {
        getEvent.mockReturnValue({
            id: testID, 
            title: "Workout - 10/07/2026", 
            start: "2026-10-07", 
            allDay: true, 
            extendedProps: {
                workoutExercises:[{exerciseName: "benchPress", sets: 5, reps: 5, weight: 205}]
            }
        })

        const response = await request(app).get(`/api/events/${testID}`)
        
        expect(getEvent).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(testID);
    })
});

describe('DELETE /api/events/:id', () => {
    it('deletes an event that exists', async () => {
        const randomID = crypto.randomUUID();
        const dummyEvent = {
            id: randomID,
            title: "Workout - Test 10/23/2026",
            start: "2026-10-23",
            allDay: true,
            extendedProps: {
                workoutExercises:[{exerciseName: "benchPress", sets: 5, reps: 5, weight: 205}]
            }
        };

        const postResponse = await request(app).post('/api/events').send(dummyEvent);

        expect(postResponse.status).toBe(200);

        const deleteResponse = await request(app).delete(`/api/events/${randomID}`);

        expect(deleteResponse.status).toBe(200);
    })

    it('fails deleting an event that does not exist', async () => {
        const randomID = crypto.randomUUID();

        const response = await request(app).delete(`/api/events/${randomID}`);

        expect(response.status).toBe(500);
    })
});

describe('POST /api/events', () => {
    it('creates an event', async () => {
        const dummyEvent = {
            id: testID, 
            title: "Workout - Test", 
            start: "2026-10-07", 
            allDay: true, 
            extendedProps: {
                workoutExercises:[{exerciseName: "benchPress", sets: 5, reps: 5, weight: 205}]
            }
        }
        const response = await request(app).post('/api/events').send(dummyEvent);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Event was created.");
    });

    it('does not return 200 for a bad request', async () => {
        const response = await request(app).post('/api/events').send({});

        expect([400, 500]).toContain(response.status);
        expect(response.body.success).toBe(false);
    })

    it('returns 400 if an event has no exercises', async () => {
        const dummyData = {
            id: "foo",
            title: "bar",
            start: "2026-10-14",
            allDay: true,
            extendedProps: {
                workoutExercises: []
            }
        };

        const response = await request(app).post('/api/events').send(dummyData);

        expect(response.status).toBe(400);
    })
});

