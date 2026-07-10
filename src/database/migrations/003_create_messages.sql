CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL REFERENCES chats(id),
    sender_id BIGINT NOT NULL REFERENCES users(id),
    type TEXT NOT NULL,
    body TEXT,
    reply_to_id BIGINT REFERENCES messages(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    edited_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_messages_chat ON messages(chat_id);

CREATE INDEX idx_messages_sender ON messages(sender_id);

CREATE INDEX idx_messages_created ON messages(chat_id, created_at DESC);