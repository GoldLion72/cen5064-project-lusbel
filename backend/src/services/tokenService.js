import jwt from 'jsonwebtoken';

// Token strategy. Any object exposing { sign, verify } can replace this one.
function createTokenService({secret, expiresIn = '1d'}) {
    if(!secret) {
        throw new Error("A token secret is required.");
    }

    const sign = (payload) => jwt.sign(payload, secret, {expiresIn});

    // Returns the decoded payload, or null when the token is missing, expired, or tampered with.
    const verify = (token) => {
        if(!token) return null;
        try {
            return jwt.verify(token, secret);
        } catch {
            return null;
        }
    };

    return {sign, verify};
}

export {createTokenService};
