// The one place that knows the API's base URL and that requests must carry the auth cookie.

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

// Low-level: returns the raw Response so callers keep full control over status handling.
export function apiFetch(path, options = {}) {
    return fetch(`${API_BASE_URL}${path}`, {credentials: 'include', ...options});
}

// High-level: sends/receives JSON, unwraps the backend's {success, message, data} envelope,
// and throws ApiError for HTTP errors, unsuccessful responses, or an unreachable server.
export async function requestJson(path, {method = 'GET', body} = {}) {
    const options = {method};
    if(body !== undefined) {
        options.headers = {'Content-Type': 'application/json'};
        options.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await apiFetch(path, options);
    } catch {
        throw new ApiError(0, "Could not reach the server. Please try again later.");
    }

    let payload = null;
    try {
        payload = await response.json();
    } catch {
        // Non-JSON body; fall through to the generic message below.
    }

    if(!response.ok || payload?.success === false) {
        throw new ApiError(response.status, payload?.message ?? "Something went wrong.");
    }

    return payload?.data;
}
