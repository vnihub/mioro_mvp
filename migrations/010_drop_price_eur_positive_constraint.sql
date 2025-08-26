-- migrations/010_drop_price_eur_positive_constraint.sql
ALTER TABLE price_entries DROP CONSTRAINT IF EXISTS price_eur_positive;
