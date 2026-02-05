CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  openid TEXT NOT NULL UNIQUE,
  nickname TEXT,
  avatar TEXT,
  ai_api_key TEXT,
  create_time TEXT NOT NULL DEFAULT (datetime('now')),
  update_time TEXT NOT NULL DEFAULT (datetime('now')),
  ext_info TEXT
);

CREATE TRIGGER IF NOT EXISTS users_update_time
AFTER UPDATE ON users
BEGIN
  UPDATE users SET update_time = datetime('now') WHERE id = NEW.id;
END;

CREATE TABLE IF NOT EXISTS training_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  score INTEGER,
  duration_minutes INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
