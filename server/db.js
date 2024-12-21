const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./escape_game.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database.');

  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      endTime INTEGER NOT NULL
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS puzzles (
      userId INTEGER,
      puzzleNumber INTEGER,
      answer TEXT NOT NULL,
      solved INTEGER DEFAULT 0,
      PRIMARY KEY (userId, puzzleNumber),
      FOREIGN KEY (userId) REFERENCES users(id)
    )`
  );
});

module.exports = db;
