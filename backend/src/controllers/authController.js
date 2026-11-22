import { authService } from '../services/index.js';
import { AuthError, AuthErrorCodes } from '../services/authService.js';
import { setAuthCookie, clearAuthCookie } from './authCookie.js';

const statusForAuthError = {
    [AuthErrorCodes.INVALID_INPUT]: 400,
    [AuthErrorCodes.INVALID_CREDENTIALS]: 401,
    [AuthErrorCodes.EMAIL_TAKEN]: 409
};

// Turns a known AuthError into a JSON response. Anything else goes to the error handler.
function handleAuthError(error, res) {
    if(error instanceof AuthError) {
        res.status(statusForAuthError[error.code] ?? 400).json({success: false, message: error.message, data: {}});
        return;
    }
    throw error;
}

async function register(req, res) {
    const {email, password} = req.body ?? {};
    try {
        const {user, token} = await authService.register(email, password);
        setAuthCookie(res, token);
        res.status(201).json({success: true, message: "Account created.", data: user});
    } catch (error) {
        handleAuthError(error, res);
    }
}

async function login(req, res) {
    const {email, password} = req.body ?? {};
    try {
        const {user, token} = await authService.login(email, password);
        setAuthCookie(res, token);
        res.status(200).json({success: true, message: "Logged in.", data: user});
    } catch (error) {
        handleAuthError(error, res);
    }
}

function logout(req, res) {
    clearAuthCookie(res);
    res.status(200).json({success: true, message: "Logged out.", data: {}});
}

// req.user is set by requireAuth. Re-check that the account still exists (e.g. after the database is reset).
function me(req, res) {
    const user = authService.getUserById(req.user.id);
    if(!user) {
        clearAuthCookie(res);
        res.status(401).json({success: false, message: "Not logged in.", data: {}});
        return;
    }
    res.status(200).json({success: true, message: "Current user.", data: user});
}

export {register, login, logout, me};
