CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);