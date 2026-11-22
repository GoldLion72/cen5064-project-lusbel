import * as usersModel from '../models/usersModel.js';
import { createPasswordHasher } from './passwordHasher.js';
import { createTokenService } from './tokenService.js';
import { createAuthService } from './authService.js';

// Composition root: the only place that chooses concrete implementations.

const DEV_SECRET = "dev-only-insecure-secret-change-me";
const secret = process.env.JWT_SECRET ?? (process.env.NODE_ENV === "production" ? undefined : DEV_SECRET);

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

const tokenService = createTokenService({secret, expiresIn: TOKEN_TTL_MS / 1000});
const passwordHasher = createPasswordHasher({rounds: process.env.NODE_ENV === "test" ? 4 : 10});
const authService = createAuthService({usersModel, hasher: passwordHasher, tokens: tokenService});

export {authService, tokenService, TOKEN_TTL_MS};
