-- migrations/000_add_region_id_to_cities.sql

ALTER TABLE cities
ADD COLUMN region_id INTEGER REFERENCES regions(id) ON DELETE RESTRICT;
