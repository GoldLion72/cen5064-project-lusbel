import request from 'supertest';
import app from '../src/app';
import {retrieveEvents} from '../src/models/progressModel';
import {describe, it, expect, vi, afterEach, beforeAll} from 'vitest';
import { loggedInAgent } from './helpers/authAgent.js';

vi.mock('../src/models/progressModel', () => ({
    retrieveEvents: vi.fn()
}))

let agent;
let user;

beforeAll(async () => {
    ({agent, user} = await loggedInAgent(app));
});

afterEach(() => {
    vi.clearAllMocks();
})

describe('authentication on /api/progress', () => {
    it('returns 401 without an auth cookie', async () => {
        const response = await request(app).get('/api/progress').query('startDate=2026-11-10&endDate=2026-11-15&exercise=benchPress&metric=reps');

        expect(response.status).toBe(401);
        expect(retrieveEvents).not.toHaveBeenCalled();
    });

    it('passes the logged-in user ID to the model', async () => {
        vi.mocked(retrieveEvents).mockReturnValueOnce([{DATE: '2026-11-10', VALUE: 8}]);

        await agent.get('/api/progress').query('startDate=2026-11-10&endDate=2026-11-15&exercise=benchPress&metric=reps');

        expect(retrieveEvents).toHaveBeenCalledWith(user.id, '2026-11-10', '2026-11-15', 'benchPress', 'reps');
    });
});

describe('GET /progress', () => {
    it('returns an invalid dates error for non-date values', async () => {
        const response = await agent.get('/api/progress').query('startDate=blah&endDate=blahblah&exercise=benchPress&metric=weight');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid dates.');
    });

    it('returns an invalid dates error when start is greater than end', async () => {
        const response = await agent.get('/api/progress').query('startDate=2026-11-18&endDate=2026-11-15&exercise=benchPress&metric=weight');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid dates.');
    });

    it('throws an error when an invalid metric is entered.', async () => {
        const response = await agent.get('/api/progress').query('startDate=2026-11-15&endDate=2026-11-20&exercise=benchPress&metric=test');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Something went wrong.');
    });

    it('indicates that progress was made when value of end is greater than value of start', async () => {
        vi.mocked(retrieveEvents).mockReturnValue([
            {DATE: '2026-11-10', VALUE: 8},
            {DATE: '2026-11-14', VALUE: 12}
        ]);

        const response = await agent.get('/api/progress').query('startDate=2026-11-10&endDate=2026-11-15&exercise=shoulderPress&metric=reps');
        
        expect(retrieveEvents).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.data.progressMade).toBe(true);
    });

    it('indicates that progress was not made when value of end is not greater than value of start', async () => {
        vi.mocked(retrieveEvents).mockReturnValue([
            {DATE: '2026-11-10', VALUE: 12},
            {DATE: '2026-11-14', VALUE: 8}
        ]);

        const response = await agent.get('/api/progress').query('startDate=2026-11-10&endDate=2026-11-15&exercise=shoulderPress&metric=reps');
        
        expect(retrieveEvents).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.data.progressMade).toBe(false);
    });

    it('returns an error when no events are found.', async () => {
        vi.mocked(retrieveEvents).mockReturnValue([]);

        const response = await agent.get('/api/progress').query('startDate=2026-11-10&endDate=2026-11-15&exercise=shoulderPress&metric=reps');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No events found.');
    });
});