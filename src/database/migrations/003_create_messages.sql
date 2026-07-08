CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    edited_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

ALTER TABLE
    chat_members
ADD
    CONSTRAINT fk_last_read_message FOREIGN KEY (last_read_message_id) REFERENCES messages(id) ON DELETE
SET
    NULL;

CREATE INDEX idx_messages_chat ON messages (chat_id, created_at DESC);

CREATE INDEX idx_messages_sender ON messages (sender_id);