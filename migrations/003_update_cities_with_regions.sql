-- migrations/003_update_cities_with_regions.sql

UPDATE cities
SET region_id = (SELECT id FROM regions WHERE slug = 'comunidad-de-madrid')
WHERE slug = 'madrid';

UPDATE cities
SET region_id = (SELECT id FROM regions WHERE slug = 'cataluna')
WHERE slug = 'barcelona';
