// Client-side account rules, shared by the login and create-account forms.
// They mirror backend/src/domain/account.js; the server still validates everything.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_RULE_MESSAGE = `Password must be at least ${MIN_PASSWORD_LENGTH} characters and contain a letter and a number.`;

export function isValidEmail(email) {
    return typeof email === "string" && EMAIL_PATTERN.test(email.trim());
}

export function isStrongPassword(password) {
    return typeof password === "string"
        && password.length >= MIN_PASSWORD_LENGTH
        && /[A-Za-z]/.test(password)
        && /\d/.test(password);
}
