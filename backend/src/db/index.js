import fs from 'node:fs';
import Database from 'better-sqlite3';
import path from 'node:path'
import { fileURLToPath } from 'node:url';

const fileToUse = process.env.NODE_ENV === "test" ? ":memory:" : "app.db";
const db = new Database(fileToUse);

db.pragma('journal_mode = WAL');

try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const schemaSQL = fs.readFileSync(__dirname + '/schema.sql', 'utf8');
    db.exec(schemaSQL);
} catch (error) {
    console.error("Failed to read schema file:", error);
}

export default db;