-- Seed Cities
INSERT INTO cities (id, country_code, name, slug) VALUES
(1, 'ES', 'Madrid', 'madrid'),
(2, 'ES', 'Barcelona', 'barcelona')
ON CONFLICT (id) DO NOTHING;

-- Seed Merchants
INSERT INTO merchants (id, legal_name, display_name, contact_email, status, verification_level) VALUES
(1, 'Oro Rápido Centro S.L.', 'Oro Rápido Centro', 'contact@ororapido.es', 'approved', 'basic'),
(2, 'Compro Oro Sol S.A.', 'Compro Oro Sol', 'info@comproorosol.es', 'approved', 'none'),
(3, 'PlataBCN Group', 'Plata BCN', 'hola@platabcn.es', 'approved', 'basic')
ON CONFLICT (id) DO NOTHING;

-- Seed Shops
INSERT INTO shops (id, merchant_id, city_id, name, address_line, is_dummy, is_active, last_price_update_at) VALUES
(1, 1, 1, 'Oro Rápido Centro', 'Calle de Alcalá 123, Madrid', true, true, NOW()),
(2, 2, 1, 'Compro Oro Sol', 'Puerta del Sol 10, Madrid', true, true, NOW()),
(3, 1, 1, 'Oro Rápido Atocha', 'Plaza del Emperador Carlos V, Madrid', true, true, NOW()),
(4, 3, 2, 'Plata BCN Gràcia', 'Carrer de la Plata 5, Barcelona', true, true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Bullion SKUs
INSERT INTO bullion_skus (id, brand, product_name, metal_code, weight_grams) VALUES
(1, 'Valcambi', '1 oz Gold Bar', 'gold', 31.1035),
(2, 'Royal Mint', '1 oz Silver Britannia', 'silver', 31.1035)
ON CONFLICT (id) DO NOTHING;

-- Seed Price Entries for Shops
-- Note: The purity_id values correspond to the ones seeded in schema.sql
-- Gold: 4=18K, 7=24K
-- Silver: 11=925
-- Platinum: 14=950

-- Shop 1: Oro Rápido Centro (Madrid)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(1, 'gold', 4, 'scrap', 'buy', 'per_gram', 42.50),
(1, 'gold', 7, 'scrap', 'buy', 'per_gram', 58.10),
(1, 'silver', 11, 'scrap', 'buy', 'per_gram', 0.75),
(1, 'platinum', 14, 'scrap', 'buy', 'per_gram', 25.50)
ON CONFLICT (shop_id, side, purity_id) WHERE context = 'scrap' DO NOTHING;

-- Bullion for Shop 1
INSERT INTO price_entries (shop_id, metal_code, bullion_sku_id, context, side, unit, price_eur) VALUES
(1, 'gold', 1, 'bullion', 'buy', 'per_item', 2350.00),
(1, 'gold', 1, 'bullion', 'sell', 'per_item', 2480.00)
ON CONFLICT (shop_id, side, bullion_sku_id) WHERE context = 'bullion' DO NOTHING;

-- Shop 2: Compro Oro Sol (Madrid)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(2, 'gold', 4, 'scrap', 'buy', 'per_gram', 41.90),
(2, 'gold', 7, 'scrap', 'buy', 'per_gram', 57.50),
(2, 'silver', 11, 'scrap', 'buy', 'per_gram', 0.72)
ON CONFLICT (shop_id, side, purity_id) WHERE context = 'scrap' DO NOTHING;

-- Shop 3: Oro Rápido Atocha (Madrid)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(3, 'gold', 4, 'scrap', 'buy', 'per_gram', 42.80)
ON CONFLICT (shop_id, side, purity_id) WHERE context = 'scrap' DO NOTHING;

-- Shop 4: Plata BCN Gràcia (Barcelona)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(4, 'gold', 4, 'scrap', 'buy', 'per_gram', 42.20),
(4, 'silver', 11, 'scrap', 'buy', 'per_gram', 0.80),
(4, 'platinum', 14, 'scrap', 'buy', 'per_gram', 26.00)
ON CONFLICT (shop_id, side, purity_id) WHERE context = 'scrap' DO NOTHING;

-- Bullion for Shop 4
INSERT INTO price_entries (shop_id, metal_code, bullion_sku_id, context, side, unit, price_eur) VALUES
(4, 'silver', 2, 'bullion', 'buy', 'per_item', 30.00),
(4, 'silver', 2, 'bullion', 'sell', 'per_item', 38.50)
ON CONFLICT (shop_id, side, bullion_sku_id) WHERE context = 'bullion' DO NOTHING;
