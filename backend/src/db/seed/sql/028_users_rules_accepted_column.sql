-- 028: Add rules_accepted_at to users
ALTER TABLE users ADD COLUMN rules_accepted_at DATETIME(3) NULL AFTER updated_at;
