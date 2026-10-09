vi.mock(import('../src/models/eventsModel'), async (importOriginal) => {
    const originalModule = await importOriginal();
    return {
        ...originalModule,
        getEvent: vi.fn(),
    }
    
})
import request from 'supertest';
import app from '../src/app';
import {getEvent} from '../src/models/eventsModel';
import {describe, it, expect, vi, afterEach} from 'vitest';

const testID = crypto.randomUUID();

describe('GET /api/events', () => {
    it('returns JSON', async () => {
        const response = await request(app).get('/api/events')
        
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
    });

    it('returns event data', async () => {
        const response = await request(app).get('/api/events');

        expect(response.status).toBe(200);
        expect(response.body.data instanceof Array).toBe(true);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length > 0).toBe(true);

    })
});

describe('GET /api/event/:id', () => {
    it('returns event matching given ID', async () => {
        getEvent.mockReturnValue({
            id: testID, 
            title: "Workout - 10/07/2026", 
            start: "10/07/2026", 
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

describe('POST /api/events', () => {
    it('creates an event', async () => {
        const dummyEvent = {
            id: testID, 
            title: "Workout - Test", 
            start: "10/07/2026", 
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

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
    })
});

afterEach(() => {
    vi.restoreAllMocks();
});