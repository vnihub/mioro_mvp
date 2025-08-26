-- migrations/008_add_description_to_shops.sql

ALTER TABLE shops
ADD COLUMN description TEXT;
