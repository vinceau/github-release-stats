CREATE TABLE download_count (
    id serial PRIMARY KEY,
    release_id VARCHAR NOT NULL,
    asset_id VARCHAR NOT NULL,
    downloads INTEGER NOT NULL CHECK (downloads >= 0),
    tstz TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
