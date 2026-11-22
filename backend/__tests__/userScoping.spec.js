import request from 'supertest';
import app from '../src/app';
import {describe, it, expect, beforeAll} from 'vitest';
import { loggedInAgent } from './helpers/authAgent.js';

// No model mocks here: this runs against the real in-memory database to prove users can't see each other's data.

const makeEvent = (start, exerciseName = "benchPress", weight = 205) => ({
    id: crypto.randomUUID(),
    title: `Workout - ${start}`,
    start,
    allDay: true,
    extendedProps: {
        workoutExercises: [{exerciseName, sets: 5, reps: 5, weight}]
    }
});

describe('per-user data', () => {
    let alice;
    let bob;

    beforeAll(async () => {
        alice = (await loggedInAgent(app)).agent;
        bob = (await loggedInAgent(app)).agent;
    });

    it('only lists the logged-in user\'s events', async () => {
        const aliceEvent = makeEvent("2026-09-01");
        await alice.post('/api/events').send(aliceEvent);

        const aliceList = await alice.get('/api/events');
        const bobList = await bob.get('/api/events');

        expect(aliceList.body.data.map(e => e.id)).toContain(aliceEvent.id);
        expect(bobList.body.data.map(e => e.id)).not.toContain(aliceEvent.id);
    });

    it('lets two users log a workout on the same date', async () => {
        const first = await alice.post('/api/events').send(makeEvent("2026-09-02"));
        const second = await bob.post('/api/events').send(makeEvent("2026-09-02"));

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
    });

    it('returns 404 when reading another user\'s event', async () => {
        const aliceEvent = makeEvent("2026-09-03");
        await alice.post('/api/events').send(aliceEvent);

        const response = await bob.get(`/api/events/${aliceEvent.id}`);

        expect(response.status).toBe(404);
    });

    it('does not let a user delete another user\'s event', async () => {
        const aliceEvent = makeEvent("2026-09-04");
        await alice.post('/api/events').send(aliceEvent);

        const bobDelete = await bob.delete(`/api/events/${aliceEvent.id}`);
        expect(bobDelete.status).not.toBe(200);

        const stillThere = await alice.get(`/api/events/${aliceEvent.id}`);
        expect(stillThere.status).toBe(200);
        expect(stillThere.body.data.extendedProps.workoutExercises).toHaveLength(1);
    });

    it('only includes the logged-in user\'s workouts in progress results', async () => {
        await alice.post('/api/events').send(makeEvent("2026-08-01", "squat", 100));
        await alice.post('/api/events').send(makeEvent("2026-08-05", "squat", 120));
        await bob.post('/api/events').send(makeEvent("2026-08-03", "squat", 999));

        const response = await alice.get('/api/progress').query('startDate=2026-08-01&endDate=2026-08-10&exercise=squat&metric=weight');

        expect(response.status).toBe(200);
        expect(response.body.data.events.map(e => e.VALUE)).toEqual([100, 120]);
    });
});
