-- migrations/004_add_is_capital_to_cities.sql

ALTER TABLE cities
ADD COLUMN is_capital BOOLEAN NOT NULL DEFAULT false;
