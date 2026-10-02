const fs = require('node:fs');
const db = require('better-sqlite3')('app.db');

db.pragma('journal_mode = WAL');

try {
    const schemaSQL = fs.readFileSync('schema.sql', 'utf8');
    db.exec(schemaSQL);
} catch (error) {
    console.error("Failed to read schema file:", error);
}

module.exports = db;