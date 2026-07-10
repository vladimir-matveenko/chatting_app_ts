CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    body TEXT,
    reply_to_id BIGINT NULL,
    edited_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_messages_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_reply FOREIGN KEY (reply_to_id) REFERENCES messages(id) ON DELETE
    SET
        NULL
);

CREATE INDEX idx_messages_chat ON messages(chat_id);

CREATE INDEX idx_messages_sender ON messages(sender_id);

CREATE INDEX idx_messages_created ON messages(chat_id, created_at DESC);