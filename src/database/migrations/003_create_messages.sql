CREATE TYPE message_type AS ENUM (
    'text',
    'image',
    'video',
    'audio',
    'file',
    'system'
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id),
    type message_type NOT NULL,
    body TEXT,
    reply_to_id BIGINT REFERENCES messages(id) ON DELETE
    SET
        NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        deleted_at TIMESTAMPTZ,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_messages_chat ON messages(chat_id);

CREATE INDEX idx_messages_sender ON messages(sender_id);

CREATE INDEX idx_messages_created ON messages(chat_id, created_at DESC);

CREATE INDEX idx_messages_deleted ON messages(is_deleted);

CREATE INDEX idx_messages_reply ON messages(reply_to_id);