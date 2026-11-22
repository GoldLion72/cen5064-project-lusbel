import db from '../db/index.js';

// Data tier: SQL for the USERS table only. No hashing or validation happens here.

function toUser(row) {
    if(!row) return null;
    return {
        id: row.USER_ID,
        email: row.EMAIL,
        passwordHash: row.PASSWORD_HASH,
        createdAt: row.CREATED_AT
    };
}

function findUserByEmail(email) {
    const stmt = db.prepare("SELECT * FROM USERS WHERE EMAIL = ?;");
    return toUser(stmt.get(email));
}

function findUserById(id) {
    const stmt = db.prepare("SELECT * FROM USERS WHERE USER_ID = ?;");
    return toUser(stmt.get(id));
}

// Returns true when the user was inserted, false when the email is already taken (UNIQUE constraint).
function insertUser({id, email, passwordHash}) {
    const stmt = db.prepare("INSERT INTO USERS (USER_ID, EMAIL, PASSWORD_HASH, CREATED_AT) VALUES (?, ?, ?, ?);");
    try {
        stmt.run(id, email, passwordHash, new Date().toISOString());
        return true;
    } catch (error) {
        if(error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return false;
        }
        throw error;
    }
}

export {findUserByEmail, findUserById, insertUser};
