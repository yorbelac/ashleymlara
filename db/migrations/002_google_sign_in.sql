-- "Sign in with Google" support.
-- google_sub is Google's permanent id for the person (it stays the same even if their email changes).
-- Google-only accounts have no password, so password_hash becomes optional.
ALTER TABLE users ADD COLUMN google_sub text UNIQUE;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
