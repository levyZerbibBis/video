-- Drop tables if they exist
DROP TABLE IF EXISTS streams;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create streams table
CREATE TABLE streams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('live', 'off')) DEFAULT 'off',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert some sample data
INSERT INTO users (username) VALUES 
    ('broadcaster1'),
    ('broadcaster2');

INSERT INTO streams (title, user_id, status) VALUES 
    ('My First Live Stream', 1, 'off'),
    ('Gaming Session', 2, 'off'); 