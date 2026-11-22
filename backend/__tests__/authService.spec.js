import {describe, it, expect, beforeEach} from 'vitest';
import { createAuthService, AuthError, AuthErrorCodes } from '../src/services/authService.js';

// The service only depends on small injected interfaces, so plain fakes are enough (no database, bcrypt, or JWT).
function createFakes() {
    const users = new Map();
    const usersModel = {
        findUserByEmail: (email) => [...users.values()].find(u => u.email === email) ?? null,
        findUserById: (id) => users.get(id) ?? null,
        insertUser: (user) => {
            if([...users.values()].some(u => u.email === user.email)) return false;
            users.set(user.id, user);
            return true;
        }
    };
    const hasher = {
        hash: async (pw) => `hashed:${pw}`,
        verify: async (pw, hash) => hash === `hashed:${pw}`
    };
    const tokens = {
        sign: (payload) => `token-for-${payload.sub}`,
        verify: () => null
    };
    let nextId = 1;
    const generateId = () => `id-${nextId++}`;

    return {users, usersModel, hasher, tokens, generateId};
}

describe('authService', () => {
    let fakes;
    let service;

    beforeEach(() => {
        fakes = createFakes();
        service = createAuthService(fakes);
    });

    it('registers a user with a hashed password and returns a token', async () => {
        const result = await service.register("Person@Example.com", "password123");

        expect(result).toEqual({user: {id: "id-1", email: "person@example.com"}, token: "token-for-id-1"});
        expect(fakes.users.get("id-1").passwordHash).toBe("hashed:password123");
    });

    it('rejects an invalid email', async () => {
        await expect(service.register("nope", "password123")).rejects.toMatchObject({code: AuthErrorCodes.INVALID_INPUT});
    });

    it('rejects a password without a number', async () => {
        await expect(service.register("a@b.com", "passwordonly")).rejects.toMatchObject({code: AuthErrorCodes.INVALID_INPUT});
    });

    it('rejects a duplicate email', async () => {
        await service.register("a@b.com", "password123");

        await expect(service.register("A@B.com", "password123")).rejects.toMatchObject({code: AuthErrorCodes.EMAIL_TAKEN});
    });

    it('reports EMAIL_TAKEN when the insert loses a race', async () => {
        fakes.usersModel.findUserByEmail = () => null;
        fakes.usersModel.insertUser = () => false;

        await expect(service.register("a@b.com", "password123")).rejects.toMatchObject({code: AuthErrorCodes.EMAIL_TAKEN});
    });

    it('logs in with the right password', async () => {
        await service.register("a@b.com", "password123");

        const result = await service.login("a@b.com", "password123");

        expect(result.user.email).toBe("a@b.com");
        expect(result.token).toBe("token-for-id-1");
    });

    it('rejects a wrong password and an unknown email with the same error', async () => {
        await service.register("a@b.com", "password123");

        const wrongPassword = service.login("a@b.com", "wrong1234").catch(e => e);
        const unknownEmail = service.login("x@y.com", "password123").catch(e => e);

        for(const error of await Promise.all([wrongPassword, unknownEmail])) {
            expect(error).toBeInstanceOf(AuthError);
            expect(error.code).toBe(AuthErrorCodes.INVALID_CREDENTIALS);
            expect(error.message).toBe("Invalid email or password.");
        }
    });

    it('getUserById never exposes the password hash', async () => {
        await service.register("a@b.com", "password123");

        expect(service.getUserById("id-1")).toEqual({id: "id-1", email: "a@b.com"});
        expect(service.getUserById("missing")).toBeNull();
    });
});
