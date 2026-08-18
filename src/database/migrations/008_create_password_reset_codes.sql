CREATE TABLE password_reset_codes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,
    reset_token_hash TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reset_token_expires_at TIMESTAMPTZ
);

CREATE INDEX idx_password_reset_codes_user_id ON password_reset_codes(user_id);

CREATE INDEX idx_password_reset_codes_expires_at ON password_reset_codes(expires_at);

CREATE INDEX idx_password_reset_codes_reset_token_hash ON password_reset_codes(reset_token_hash)
WHERE
    reset_token_hash IS NOT NULL
    AND used_at IS NULL;