-- Create a table to store the quiz scores and user details
CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  timeMs INTEGER NOT NULL,
  at INTEGER NOT NULL
);

-- Example POST (Insert)
-- INSERT INTO scores (name, score, total, timeMs, at) VALUES ('Ahmad', 6, 10, 24941, 1791355593240);

-- Example GET (Select Top Scores)
-- SELECT * FROM scores ORDER BY score DESC, timeMs ASC LIMIT 10;
