-- Database schema for the Mioro MVP

-- Reference table for cities
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Merchants who own shops
CREATE TABLE merchants (
    id SERIAL PRIMARY KEY,
    legal_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    tax_id TEXT,
    website_url TEXT,
    contact_email TEXT UNIQUE NOT NULL,
    contact_phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    verification_level TEXT NOT NULL DEFAULT 'none', -- none, basic, verified
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual shop locations
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    merchant_id INTEGER NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    logo_url TEXT,
    address_line TEXT NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    phone TEXT,
    whatsapp TEXT,
    opening_hours JSONB,
    description TEXT,
    last_price_update_at TIMESTAMPTZ,
    is_dummy BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ON shops (city_id);
CREATE INDEX ON shops (merchant_id);
CREATE INDEX ON shops (is_active);

-- Reference table for metals
CREATE TABLE metals (
    code TEXT PRIMARY KEY, -- 'gold', 'silver', 'platinum'
    display_name TEXT NOT NULL
);

-- Reference table for purities
CREATE TABLE purities (
    id SERIAL PRIMARY KEY,
    metal_code TEXT NOT NULL REFERENCES metals(code) ON DELETE CASCADE,
    label TEXT NOT NULL, -- '18K', '925'
    fineness_ppm INTEGER, -- 750000, 925000
    UNIQUE (metal_code, label)
);

-- Reference table for bullion SKUs
CREATE TABLE bullion_skus (
    id SERIAL PRIMARY KEY,
    brand TEXT,
    product_name TEXT NOT NULL,
    metal_code TEXT NOT NULL REFERENCES metals(code) ON DELETE CASCADE,
    weight_grams NUMERIC(10, 4),
    iso_code TEXT,
    image_url TEXT
);
CREATE INDEX ON bullion_skus (metal_code);

-- Current prices for a shop
CREATE TABLE price_entries (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    metal_code TEXT NOT NULL REFERENCES metals(code) ON DELETE CASCADE,
    purity_id INTEGER REFERENCES purities(id) ON DELETE CASCADE, -- Nullable for bullion
    bullion_sku_id INTEGER REFERENCES bullion_skus(id) ON DELETE CASCADE, -- Nullable for scrap
    context TEXT NOT NULL, -- 'scrap', 'bullion'
    side TEXT NOT NULL, -- 'buy', 'sell'
    unit TEXT NOT NULL, -- 'per_gram', 'per_item'
    price_eur NUMERIC(12, 4) NOT NULL,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    source TEXT NOT NULL DEFAULT 'manual',
    notes TEXT,
    CONSTRAINT price_eur_positive CHECK (price_eur > 0),
    CONSTRAINT context_coherence CHECK (
        (context = 'scrap' AND purity_id IS NOT NULL AND bullion_sku_id IS NULL) OR
        (context = 'bullion' AND purity_id IS NULL AND bullion_sku_id IS NOT NULL)
    )
);
CREATE INDEX ON price_entries (shop_id);
CREATE INDEX ON price_entries (valid_until);
CREATE UNIQUE INDEX ON price_entries (shop_id, side, purity_id) WHERE context = 'scrap';
CREATE UNIQUE INDEX ON price_entries (shop_id, side, bullion_sku_id) WHERE context = 'bullion';


-- Audit log for price changes
CREATE TABLE price_change_logs (
    id SERIAL PRIMARY KEY,
    price_entry_id INTEGER NOT NULL REFERENCES price_entries(id) ON DELETE CASCADE,
    shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    actor TEXT NOT NULL, -- 'merchant', 'admin', 'system'
    before JSONB,
    after JSONB,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ON price_change_logs (shop_id, changed_at DESC);

-- Lead generation events
CREATE TABLE lead_events (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'call_click', 'whatsapp_click', 'directions_click'
    user_city_id INTEGER REFERENCES cities(id),
    calculator_payload JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ON lead_events (shop_id, occurred_at DESC);

-- Admin users for the platform
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'moderator', -- 'moderator', 'superadmin'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Merchant users who can log in and edit their shops
CREATE TABLE merchant_users (
    id SERIAL PRIMARY KEY,
    merchant_id INTEGER NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    twofa_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ON merchant_users (merchant_id);

-- Seed reference data
INSERT INTO metals (code, display_name) VALUES
('gold', 'Gold'),
('silver', 'Silver'),
('platinum', 'Platinum');

INSERT INTO purities (metal_code, label, fineness_ppm) VALUES
('gold', '9K', 375000),
('gold', '10K', 417000),
('gold', '14K', 585000),
('gold', '18K', 750000),
('gold', '21K', 875000),
('gold', '22K', 916000),
('gold', '24K', 999000),
('silver', '800', 800000),
('silver', '835', 835000),
('silver', '900', 900000),
('silver', '925', 925000),
('platinum', '850', 850000),
('platinum', '900', 900000),
('platinum', '950', 950000);
