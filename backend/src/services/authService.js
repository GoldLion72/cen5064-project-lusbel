import { normalizeEmail, isValidEmail, isStrongPassword } from '../domain/account.js';

class AuthError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "AuthError";
        this.code = code;
    }
}

const AuthErrorCodes = Object.freeze({
    INVALID_INPUT: "INVALID_INPUT",
    EMAIL_TAKEN: "EMAIL_TAKEN",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS"
});

// Service tier: orchestrates registration and login.
// All collaborators are injected so they can be swapped (bcrypt -> argon2, JWT -> sessions)
// or faked in tests without changing this file.
function createAuthService({usersModel, hasher, tokens, generateId = () => crypto.randomUUID()}) {

    const toPublicUser = (user) => ({id: user.id, email: user.email});

    const issueToken = (user) => tokens.sign({sub: user.id, email: user.email});

    const register = async (email, password) => {
        const normalizedEmail = normalizeEmail(email);

        if(!isValidEmail(normalizedEmail)) {
            throw new AuthError(AuthErrorCodes.INVALID_INPUT, "Please enter a valid email address.");
        }
        if(!isStrongPassword(password)) {
            throw new AuthError(AuthErrorCodes.INVALID_INPUT, "Password must be at least 8 characters and contain a letter and a number.");
        }
        if(usersModel.findUserByEmail(normalizedEmail)) {
            throw new AuthError(AuthErrorCodes.EMAIL_TAKEN, "An account with that email already exists.");
        }

        const user = {
            id: generateId(),
            email: normalizedEmail,
            passwordHash: await hasher.hash(password)
        };
        // The pre-check above gives a fast answer; this catches two sign-ups racing for the same email.
        if(!usersModel.insertUser(user)) {
            throw new AuthError(AuthErrorCodes.EMAIL_TAKEN, "An account with that email already exists.");
        }

        return {user: toPublicUser(user), token: issueToken(user)};
    };

    const login = async (email, password) => {
        const user = usersModel.findUserByEmail(normalizeEmail(email));

        // Same error for unknown email and wrong password, so attackers can't probe which emails exist.
        if(!user || typeof password !== "string" || !(await hasher.verify(password, user.passwordHash))) {
            throw new AuthError(AuthErrorCodes.INVALID_CREDENTIALS, "Invalid email or password.");
        }

        return {user: toPublicUser(user), token: issueToken(user)};
    };

    const getUserById = (id) => {
        const user = usersModel.findUserById(id);
        return user ? toPublicUser(user) : null;
    };

    return {register, login, getUserById};
}

export {createAuthService, AuthError, AuthErrorCodes};
