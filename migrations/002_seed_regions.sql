-- migrations/002_seed_regions.sql

TRUNCATE TABLE regions CASCADE;

INSERT INTO regions (country_code, name, slug) VALUES
('ES', 'Andalucía', 'andalucia'),
('ES', 'Aragón', 'aragon'),
('ES', 'Asturias', 'asturias'),
('ES', 'Islas Baleares', 'islas-baleares'),
('ES', 'País Vasco', 'pais-vasco'),
('ES', 'Islas Canarias', 'islas-canarias'),
('ES', 'Cantabria', 'cantabria'),
('ES', 'Castilla y León', 'castilla-y-leon'),
('ES', 'Castilla-La Mancha', 'castilla-la-mancha'),
('ES', 'Cataluña', 'cataluna'),
('ES', 'Comunidad de Madrid', 'comunidad-de-madrid'),
('ES', 'Extremadura', 'extremadura'),
('ES', 'Galicia', 'galicia'),
('ES', 'La Rioja', 'la-rioja'),
('ES', 'Navarra', 'navarra'),
('ES', 'Región de Murcia', 'region-de-murcia'),
('ES', 'Comunidad Valenciana', 'comunidad-valenciana'),
('ES', 'Ceuta', 'ceuta'),
('ES', 'Melilla', 'melilla')
ON CONFLICT (slug) DO NOTHING;
