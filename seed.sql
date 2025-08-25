-- Clear existing data to ensure a clean seed
TRUNCATE TABLE cities, merchants, shops, bullion_skus, price_entries RESTART IDENTITY CASCADE;

-- Seed Cities
INSERT INTO cities (id, country_code, name, slug, region_id, is_capital) VALUES
(1, 'ES', 'Madrid', 'madrid', (SELECT id from regions WHERE slug = 'comunidad-de-madrid'), true),
(2, 'ES', 'Barcelona', 'barcelona', (SELECT id from regions WHERE slug = 'cataluna'), true),
(3, 'ES', 'Sevilla', 'sevilla', (SELECT id from regions WHERE slug = 'andalucia'), true),
(4, 'ES', 'Zaragoza', 'zaragoza', (SELECT id from regions WHERE slug = 'aragon'), true),
(5, 'ES', 'Oviedo', 'oviedo', (SELECT id from regions WHERE slug = 'asturias'), true),
(6, 'ES', 'Palma de Mallorca', 'palma-de-mallorca', (SELECT id from regions WHERE slug = 'islas-baleares'), true),
(7, 'ES', 'Vitoria-Gasteiz', 'vitoria-gasteiz', (SELECT id from regions WHERE slug = 'pais-vasco'), true),
(8, 'ES', 'Las Palmas de Gran Canaria', 'las-palmas-de-gran-canaria', (SELECT id from regions WHERE slug = 'islas-canarias'), true),
(9, 'ES', 'Santa Cruz de Tenerife', 'santa-cruz-de-tenerife', (SELECT id from regions WHERE slug = 'islas-canarias'), false),
(10, 'ES', 'Santander', 'santander', (SELECT id from regions WHERE slug = 'cantabria'), true),
(11, 'ES', 'Valladolid', 'valladolid', (SELECT id from regions WHERE slug = 'castilla-y-leon'), true),
(12, 'ES', 'Toledo', 'toledo', (SELECT id from regions WHERE slug = 'castilla-la-mancha'), true),
(13, 'ES', 'Mérida', 'merida', (SELECT id from regions WHERE slug = 'extremadura'), true),
(14, 'ES', 'Santiago de Compostela', 'santiago-de-compostela', (SELECT id from regions WHERE slug = 'galicia'), true),
(15, 'ES', 'Logroño', 'logrono', (SELECT id from regions WHERE slug = 'la-rioja'), true),
(16, 'ES', 'Pamplona', 'pamplona', (SELECT id from regions WHERE slug = 'navarra'), true),
(17, 'ES', 'Murcia', 'murcia', (SELECT id from regions WHERE slug = 'region-de-murcia'), true),
(18, 'ES', 'Valencia', 'valencia', (SELECT id from regions WHERE slug = 'comunidad-valenciana'), true),
(19, 'ES', 'Ceuta', 'ceuta', (SELECT id from regions WHERE slug = 'ceuta'), true),
(20, 'ES', 'Melilla', 'melilla', (SELECT id from regions WHERE slug = 'melilla'), true);

-- Seed Merchants
INSERT INTO merchants (id, legal_name, display_name, contact_email, status, verification_level) VALUES
(1, 'Oro Rápido Centro S.L.', 'Oro Rápido Centro', 'contact@ororapido.es', 'approved', 'basic'),
(2, 'Compro Oro Sol S.A.', 'Compro Oro Sol', 'info@comproorosol.es', 'approved', 'none'),
(3, 'PlataBCN Group', 'Plata BCN', 'hola@platabcn.es', 'approved', 'basic');

-- Seed Shops
INSERT INTO shops (id, merchant_id, city_id, name, address_line, is_dummy, is_active, last_price_update_at) VALUES
(1, 1, 1, 'Oro Rápido Centro', 'Calle de Alcalá 123, Madrid', true, true, NOW()),
(2, 2, 1, 'Compro Oro Sol', 'Puerta del Sol 10, Madrid', true, true, NOW()),
(3, 1, 1, 'Oro Rápido Atocha', 'Plaza del Emperador Carlos V, Madrid', true, true, NOW()),
(4, 3, 2, 'Plata BCN Gràcia', 'Carrer de la Plata 5, Barcelona', true, true, NOW());

-- Seed Bullion SKUs
INSERT INTO bullion_skus (id, brand, product_name, metal_code, weight_grams) VALUES
(1, 'Valcambi', '1 oz Gold Bar', 'gold', 31.1035),
(2, 'Royal Mint', '1 oz Silver Britannia', 'silver', 31.1035),
(3, 'US Mint', '1 oz Gold American Eagle', 'gold', 31.1035),
(4, 'US Mint', '1 oz Silver American Eagle', 'silver', 31.1035),
(5, 'Royal Canadian Mint', '1/2 oz Gold Maple Leaf', 'gold', 15.5517),
(6, 'Generic', '10 oz Silver Bar', 'silver', 311.035);

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
(1, 'platinum', 14, 'scrap', 'buy', 'per_gram', 25.50);
-- Bullion for Shop 1
INSERT INTO price_entries (shop_id, metal_code, bullion_sku_id, context, side, unit, price_eur) VALUES
(1, 'gold', 1, 'bullion', 'buy', 'per_item', 2350.00),
(1, 'gold', 1, 'bullion', 'sell', 'per_item', 2480.00),
(1, 'gold', 3, 'bullion', 'buy', 'per_item', 2360.00),
(1, 'gold', 3, 'bullion', 'sell', 'per_item', 2490.00),
(1, 'silver', 4, 'bullion', 'buy', 'per_item', 28.00),
(1, 'silver', 4, 'bullion', 'sell', 'per_item', 35.00);

-- Shop 2: Compro Oro Sol (Madrid)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(2, 'gold', 4, 'scrap', 'buy', 'per_gram', 41.90),
(2, 'gold', 7, 'scrap', 'buy', 'per_gram', 57.50),
(2, 'silver', 11, 'scrap', 'buy', 'per_gram', 0.72);
-- Bullion for Shop 2
INSERT INTO price_entries (shop_id, metal_code, bullion_sku_id, context, side, unit, price_eur) VALUES
(2, 'gold', 5, 'bullion', 'buy', 'per_item', 1180.00),
(2, 'gold', 5, 'bullion', 'sell', 'per_item', 1250.00),
(2, 'silver', 6, 'bullion', 'buy', 'per_item', 280.00),
(2, 'silver', 6, 'bullion', 'sell', 'per_item', 350.00);

-- Shop 3: Oro Rápido Atocha (Madrid)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(3, 'gold', 4, 'scrap', 'buy', 'per_gram', 42.80);

-- Shop 4: Plata BCN Gràcia (Barcelona)
INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price_eur) VALUES
(4, 'gold', 4, 'scrap', 'buy', 'per_gram', 42.20),
(4, 'silver', 11, 'scrap', 'buy', 'per_gram', 0.80),
(4, 'platinum', 14, 'scrap', 'buy', 'per_gram', 26.00);
-- Bullion for Shop 4
INSERT INTO price_entries (shop_id, metal_code, bullion_sku_id, context, side, unit, price_eur) VALUES
(4, 'silver', 2, 'bullion', 'buy', 'per_item', 30.00),
(4, 'silver', 2, 'bullion', 'sell', 'per_item', 38.50),
(4, 'silver', 6, 'bullion', 'buy', 'per_item', 290.00),
(4, 'silver', 6, 'bullion', 'sell', 'per_item', 360.00);
