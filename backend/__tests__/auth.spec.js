import request from 'supertest';
import app from '../src/app';
import {describe, it, expect} from 'vitest';

const uniqueEmail = () => `user-${crypto.randomUUID()}@test.com`;
const password = "password123";

const getCookie = (response) => (response.headers['set-cookie'] ?? []).find(c => c.startsWith('token='));

describe('POST /api/auth/register', () => {
    it('creates an account and sets an httpOnly auth cookie', async () => {
        const email = uniqueEmail();
        const response = await request(app).post('/api/auth/register').send({email, password});

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe(email);
        expect(response.body.data.id).toBeTruthy();
        expect(response.body.data.passwordHash).toBeUndefined();

        const cookie = getCookie(response);
        expect(cookie).toBeDefined();
        expect(cookie).toContain('HttpOnly');
        expect(cookie).toContain('SameSite=Lax');
    });

    it('stores the email in lowercase', async () => {
        const response = await request(app).post('/api/auth/register').send({email: "  MiXeD-" + crypto.randomUUID() + "@Test.com ", password});

        expect(response.status).toBe(201);
        expect(response.body.data.email).toBe(response.body.data.email.toLowerCase());
    });

    it('returns 409 when the email is already registered, ignoring case', async () => {
        const email = uniqueEmail();
        await request(app).post('/api/auth/register').send({email, password});

        const response = await request(app).post('/api/auth/register').send({email: email.toUpperCase(), password});

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
    });

    it('returns 400 for an invalid email', async () => {
        const response = await request(app).post('/api/auth/register').send({email: "not-an-email", password});

        expect(response.status).toBe(400);
        expect(getCookie(response)).toBeUndefined();
    });

    it('returns 400 for a weak password', async () => {
        const response = await request(app).post('/api/auth/register').send({email: uniqueEmail(), password: "short"});

        expect(response.status).toBe(400);
    });

    it('returns 400 for an empty body', async () => {
        const response = await request(app).post('/api/auth/register').send({});

        expect(response.status).toBe(400);
    });
});

describe('POST /api/auth/login', () => {
    it('logs in with the correct password and sets the cookie', async () => {
        const email = uniqueEmail();
        await request(app).post('/api/auth/register').send({email, password});

        const response = await request(app).post('/api/auth/login').send({email, password});

        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe(email);
        expect(getCookie(response)).toBeDefined();
    });

    it('returns 401 for a wrong password', async () => {
        const email = uniqueEmail();
        await request(app).post('/api/auth/register').send({email, password});

        const response = await request(app).post('/api/auth/login').send({email, password: "wrongpass1"});

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid email or password.");
        expect(getCookie(response)).toBeUndefined();
    });

    it('returns the same 401 message for an unknown email', async () => {
        const response = await request(app).post('/api/auth/login').send({email: uniqueEmail(), password});

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid email or password.");
    });
});

describe('GET /api/auth/me and POST /api/auth/logout', () => {
    it('returns 401 without a cookie', async () => {
        const response = await request(app).get('/api/auth/me');

        expect(response.status).toBe(401);
    });

    it('returns 401 for a tampered token', async () => {
        const response = await request(app).get('/api/auth/me').set('Cookie', 'token=not.a.realtoken');

        expect(response.status).toBe(401);
    });

    it('returns the current user while logged in, and 401 after logout', async () => {
        const agent = request.agent(app);
        const email = uniqueEmail();
        await agent.post('/api/auth/register').send({email, password});

        const meResponse = await agent.get('/api/auth/me');
        expect(meResponse.status).toBe(200);
        expect(meResponse.body.data.email).toBe(email);

        const logoutResponse = await agent.post('/api/auth/logout');
        expect(logoutResponse.status).toBe(200);
        expect(getCookie(logoutResponse)).toMatch(/Expires=Thu, 01 Jan 1970/);

        const afterLogout = await agent.get('/api/auth/me');
        expect(afterLogout.status).toBe(401);
    });
});
