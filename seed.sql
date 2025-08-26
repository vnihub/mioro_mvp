-- Clear existing data to ensure a clean seed
TRUNCATE TABLE cities, merchants, shops, bullion_skus, price_entries RESTART IDENTITY CASCADE;

INSERT INTO regions (id, country_code, name, slug) VALUES
(1, 'ES', 'Andalucía', 'andalucia'),
(2, 'ES', 'Aragón', 'aragon'),
(3, 'ES', 'Asturias', 'asturias'),
(4, 'ES', 'Islas Baleares', 'islas-baleares'),
(5, 'ES', 'País Vasco', 'pais-vasco'),
(6, 'ES', 'Islas Canarias', 'islas-canarias'),
(7, 'ES', 'Cantabria', 'cantabria'),
(8, 'ES', 'Castilla y León', 'castilla-y-leon'),
(9, 'ES', 'Castilla-La Mancha', 'castilla-la-mancha'),
(10, 'ES', 'Cataluña', 'cataluna'),
(11, 'ES', 'Comunidad de Madrid', 'comunidad-de-madrid'),
(12, 'ES', 'Extremadura', 'extremadura'),
(13, 'ES', 'Galicia', 'galicia'),
(14, 'ES', 'La Rioja', 'la-rioja'),
(15, 'ES', 'Navarra', 'navarra'),
(16, 'ES', 'Región de Murcia', 'region-de-murcia'),
(17, 'ES', 'Comunidad Valenciana', 'comunidad-valenciana'),
(18, 'ES', 'Ceuta', 'ceuta'),
(19, 'ES', 'Melilla', 'melilla')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

-- Seed Cities
INSERT INTO cities (id, country_code, name, slug, region_id, is_capital) VALUES
(1, 'ES', 'Madrid', 'madrid', 11, true),
(2, 'ES', 'Barcelona', 'barcelona', 10, true),
(3, 'ES', 'Sevilla', 'sevilla', 1, true),
(4, 'ES', 'Zaragoza', 'zaragoza', 2, true),
(5, 'ES', 'Oviedo', 'oviedo', 3, true),
(6, 'ES', 'Palma de Mallorca', 'palma-de-mallorca', 4, true),
(7, 'ES', 'Vitoria-Gasteiz', 'vitoria-gasteiz', 5, true),
(8, 'ES', 'Las Palmas de Gran Canaria', 'las-palmas-de-gran-canaria', 6, true),
(9, 'ES', 'Santa Cruz de Tenerife', 'santa-cruz-de-tenerife', 6, false),
(10, 'ES', 'Santander', 'santander', 7, true),
(11, 'ES', 'Valladolid', 'valladolid', 8, true),
(12, 'ES', 'Toledo', 'toledo', 9, true),
(13, 'ES', 'Mérida', 'merida', 12, true),
(14, 'ES', 'Santiago de Compostela', 'santiago-de-compostela', 13, true),
(15, 'ES', 'Logroño', 'logrono', 14, true),
(16, 'ES', 'Pamplona', 'pamplona', 15, true),
(17, 'ES', 'Murcia', 'murcia', 16, true),
(18, 'ES', 'Valencia', 'valencia', 17, true),
(19, 'ES', 'Ceuta', 'ceuta', 18, true),
(20, 'ES', 'Melilla', 'melilla', 19, true)
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
(2, 'Royal Mint', '1 oz Silver Britannia', 'silver', 31.1035),
(3, 'US Mint', '1 oz Gold American Eagle', 'gold', 31.1035),
(4, 'US Mint', '1 oz Silver American Eagle', 'silver', 31.1035),
(5, 'Royal Canadian Mint', '1/2 oz Gold Maple Leaf', 'gold', 15.5517),
(6, 'Generic', '10 oz Silver Bar', 'silver', 311.035)
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
ON CONFLICT DO NOTHING;
-- Bullion for Shop 1
INSERT INTO price_entries (shop_id, metal_code, bullion_sku_id, context, side, unit, price_eur) VALUES
(1, 'gold', 1, 'bullion', 'buy', 'per_item', 2350.00),
(1, 'gold', 1, 'bullion', 'sell', 'per_item', 2480.00),
(1, 'gold', 3, 'bullion', 'buy', 'per_item', 2360.00),
(1, 'gold', 3, 'bullion', 'sell', 'per_item', 2490.00),
(1, 'silver', 4, 'bullion', 'buy', 'per_item', 28.00),
(1, 'silver', 4, 'bullion', 'sell', 'per_item', 35.00)
ON CONFLICT DO NOTHING;

-- Shop 2: Compro Oro Sol (Madrid)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(2, 'gold', 4, 'scrap', 'buy', 'per_gram', 41.90),
(2, 'gold', 7, 'scrap', 'buy', 'per_gram', 57.50),
(2, 'silver', 11, 'scrap', 'buy', 'per_gram', 0.72)
ON CONFLICT DO NOTHING;
-- Bullion for Shop 2
INSERT INTO price_entries (shop_id, metal_code, bullion_sku_id, context, side, unit, price_eur) VALUES
(2, 'gold', 5, 'bullion', 'buy', 'per_item', 1180.00),
(2, 'gold', 5, 'bullion', 'sell', 'per_item', 1250.00),
(2, 'silver', 6, 'bullion', 'buy', 'per_item', 280.00),
(2, 'silver', 6, 'bullion', 'sell', 'per_item', 350.00)
ON CONFLICT DO NOTHING;

-- Shop 3: Oro Rápido Atocha (Madrid)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(3, 'gold', 4, 'scrap', 'buy', 'per_gram', 42.80)
ON CONFLICT DO NOTHING;

-- Shop 4: Plata BCN Gràcia (Barcelona)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(4, 'gold', 4, 'scrap', 'buy', 'per_gram', 42.20),
(4, 'silver', 11, 'scrap', 'buy', 'per_gram', 0.80),
(4, 'platinum', 14, 'scrap', 'buy', 'per_gram', 26.00)
ON CONFLICT DO NOTHING;
-- Bullion for Shop 4
INSERT INTO price_entries (shop_id, metal_code, bullion_sku_id, context, side, unit, price_eur) VALUES
(4, 'silver', 2, 'bullion', 'buy', 'per_item', 30.00),
(4, 'silver', 2, 'bullion', 'sell', 'per_item', 38.50),
(4, 'silver', 6, 'bullion', 'buy', 'per_item', 290.00),
(4, 'silver', 6, 'bullion', 'sell', 'per_item', 360.00)
ON CONFLICT DO NOTHING;