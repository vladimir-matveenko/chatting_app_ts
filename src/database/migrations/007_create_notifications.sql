CREATE TYPE notification_type AS ENUM (
    'message',
    'chat_updated',
    'admin_granted',
    'admin_revoked',
    'member_added',
    'member_removed',
    'chat_invite',
    'owner_changed',
    'reaction',
    'reply'
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    payload JSONB NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);

CREATE INDEX idx_notifications_unread ON notifications(user_id)
WHERE
    is_read = FALSE;