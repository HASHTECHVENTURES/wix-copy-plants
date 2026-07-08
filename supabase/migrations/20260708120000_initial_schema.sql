-- Users table (replaces MongoDB users collection)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username TEXT NOT NULL,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    api_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Websites table (replaces MongoDB websites collection)
CREATE TABLE IF NOT EXISTS websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    website_name TEXT NOT NULL,
    prev_img_uri TEXT NOT NULL DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT FALSE,
    pages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_websites_author ON websites (author);

-- Web pages table (replaces MongoDB web-pages collection)
CREATE TABLE IF NOT EXISTS web_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL DEFAULT '',
    page_uri TEXT NOT NULL,
    page_name TEXT NOT NULL,
    project_author TEXT NOT NULL,
    website_setting JSONB NOT NULL DEFAULT '{}'::jsonb,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    page_mode INTEGER NOT NULL DEFAULT 1,
    settig_mode INTEGER NOT NULL DEFAULT -1,
    is_drop_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    analytics_id TEXT NOT NULL DEFAULT '',
    drop_index INTEGER NOT NULL DEFAULT 0,
    fonts JSONB NOT NULL DEFAULT '[]'::jsonb,
    elements JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_web_pages_project_author ON web_pages (project_author);
CREATE INDEX IF NOT EXISTS idx_web_pages_project_id ON web_pages (project_id);
CREATE INDEX IF NOT EXISTS idx_web_pages_publish_lookup ON web_pages (project_id, page_uri, published);
