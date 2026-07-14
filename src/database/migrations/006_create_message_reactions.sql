CREATE TYPE reaction_type AS ENUM ('like', 'dislike');

CREATE TABLE message_reactions (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type reaction_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_message_reaction UNIQUE (message_id, user_id)
);

CREATE INDEX idx_message_reactions_message ON message_reactions(message_id);

CREATE INDEX idx_message_reactions_user ON message_reactions(user_id);

CREATE INDEX idx_message_reactions_type ON message_reactions(type);