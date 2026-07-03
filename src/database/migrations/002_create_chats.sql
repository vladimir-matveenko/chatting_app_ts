CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_users (
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(chat_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_users_user_id ON chat_users(user_id);