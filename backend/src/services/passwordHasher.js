import bcrypt from 'bcryptjs';

// Password hashing strategy. Any object exposing { hash, verify } can replace this one.
function createPasswordHasher({rounds = 10} = {}) {
    const hash = (password) => bcrypt.hash(password, rounds);
    const verify = (password, passwordHash) => bcrypt.compare(password, passwordHash);

    return {hash, verify};
}

export {createPasswordHasher};
