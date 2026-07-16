CREATE TYPE chat_type AS ENUM ('private', 'group');

CREATE TYPE chat_member_role AS ENUM ('owner', 'admin', 'member');

CREATE TABLE chats (
    id BIGSERIAL PRIMARY KEY,
    type chat_type NOT NULL,
    fingerprint VARCHAR(64) NOT NULL,
    title VARCHAR(100),
    avatar_url TEXT,
    owner_id BIGINT REFERENCES users(id) ON DELETE
    SET
        NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT uq_chats_fingerprint UNIQUE (fingerprint)
);

CREATE TABLE chat_members (
    chat_id BIGINT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role chat_member_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_muted BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (chat_id, user_id)
);

CREATE INDEX idx_chat_members_user_archived ON chat_members(user_id, is_archived);