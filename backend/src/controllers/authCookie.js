import { TOKEN_TTL_MS } from '../services/index.js';

// One place for the auth cookie's name and options, so set and clear always match.
const AUTH_COOKIE_NAME = "token";

const cookieOptions = () => ({
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
});

function setAuthCookie(res, token) {
    res.cookie(AUTH_COOKIE_NAME, token, {...cookieOptions(), maxAge: TOKEN_TTL_MS});
}

function clearAuthCookie(res) {
    res.clearCookie(AUTH_COOKIE_NAME, cookieOptions());
}

function readAuthCookie(req) {
    return req.cookies?.[AUTH_COOKIE_NAME];
}

export {AUTH_COOKIE_NAME, setAuthCookie, clearAuthCookie, readAuthCookie};
