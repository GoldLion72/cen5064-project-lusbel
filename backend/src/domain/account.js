// Domain tier: account rules. Pure functions with no I/O.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function normalizeEmail(email) {
    return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function isValidEmail(email) {
    return typeof email === "string" && EMAIL_PATTERN.test(email.trim());
}

// At least 8 characters, with at least one letter and one digit.
function isStrongPassword(password) {
    return typeof password === "string"
        && password.length >= MIN_PASSWORD_LENGTH
        && /[A-Za-z]/.test(password)
        && /\d/.test(password);
}

export {normalizeEmail, isValidEmail, isStrongPassword, MIN_PASSWORD_LENGTH};
