-- migrations/006_revert_email_verification.sql

ALTER TABLE merchant_users
DROP COLUMN is_email_verified,
DROP COLUMN verification_token;
