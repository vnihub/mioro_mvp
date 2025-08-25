-- migrations/001_add_regions.sql

CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cities
ADD COLUMN region_id INTEGER REFERENCES regions(id) ON DELETE RESTRICT;

-- Add an index for the new column
CREATE INDEX ON cities (region_id);

