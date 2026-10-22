-- Everyone who has an account on the site.
-- role decides what they can see: 'user' (regular visitor) or 'admin' (can use the Studio).
CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE CHECK (email = lower(email)),
  name          text,
  password_hash text NOT NULL, -- "salt:hash" from scrypt, never the real password
  role          text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    timestamptz NOT NULL DEFAULT now()
);
