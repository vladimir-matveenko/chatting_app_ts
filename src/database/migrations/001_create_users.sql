CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    avatar_public_id TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);