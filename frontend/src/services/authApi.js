import { requestJson } from './apiClient.js';

// HTTP calls for authentication. Each resolves to the user ({id, email}) or throws ApiError.

export const register = (email, password) =>
    requestJson('/auth/register', {method: 'POST', body: {email, password}});

export const login = (email, password) =>
    requestJson('/auth/login', {method: 'POST', body: {email, password}});

export const logout = () =>
    requestJson('/auth/logout', {method: 'POST'});

export const me = () =>
    requestJson('/auth/me');
