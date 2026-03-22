-- SQL schema for relational database (PostgreSQL) representing the main domain
-- Tables: users, camps, tents, bookings, tickets, payments, event_venues
-- This schema mirrors the existing Mongoose models and adds referential integrity (foreign keys)

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  avatar TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'camper',
  is_internal BOOLEAN DEFAULT FALSE,
  must_reset_password BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  business_name VARCHAR(255),
  business_description TEXT,
  business_location TEXT,
  business_license_url TEXT,
  gov_id TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
CREATE INDEX IF NOT EXISTS users_phone_idx ON users (phone);

-- Camps (camphomes)
CREATE TABLE IF NOT EXISTS camps (
  id SERIAL PRIMARY KEY,
  manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  location JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(50) DEFAULT 'Pending',
  status_color VARCHAR(50),
  text_color VARCHAR(50),
  badge VARCHAR(100),
  rating NUMERIC(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  price NUMERIC(12,2) DEFAULT 0,
  base_price NUMERIC(12,2) DEFAULT 0,
  capacity_current INTEGER DEFAULT 0,
  capacity_total INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS camps_manager_idx ON camps (manager_id);

-- Tents
CREATE TABLE IF NOT EXISTS tents (
  id SERIAL PRIMARY KEY,
  camp_id INTEGER NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  manager_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 1,
  price_per_night NUMERIC(12,2) NOT NULL DEFAULT 0,
  amenities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  available BOOLEAN DEFAULT TRUE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tents_camp_idx ON tents (camp_id);

-- Event venues
CREATE TABLE IF NOT EXISTS event_venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  camper_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tent_id INTEGER NOT NULL REFERENCES tents(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_option VARCHAR(50) DEFAULT 'prepaid',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  status VARCHAR(50) DEFAULT 'pending',
  id_document_url TEXT,
  no_show BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  grace_expiry TIMESTAMPTZ,
  auto_cancel_at TIMESTAMPTZ,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bookings_camper_idx ON bookings (camper_id);
CREATE INDEX IF NOT EXISTS bookings_tent_idx ON bookings (tent_id);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  price NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tickets_booking_idx ON tickets (booking_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'ETB',
  provider VARCHAR(100),
  provider_reference VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payments_booking_idx ON payments (booking_id);
CREATE INDEX IF NOT EXISTS payments_user_idx ON payments (user_id);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Example view: aggregated overview
CREATE OR REPLACE VIEW dashboard_overview AS
  SELECT
    (SELECT count(*) FROM camps) AS total_camps,
    (SELECT count(*) FROM event_venues) AS total_event_venues,
    (SELECT count(*) FROM bookings) AS total_bookings,
    (SELECT count(*) FROM tickets) AS tickets_sold,
    (SELECT COALESCE(sum(amount),0) FROM payments WHERE status = 'paid') AS total_earnings,
    (SELECT count(*) FROM users WHERE is_active = true) AS active_users;

-- Helpful: create function to keep updated_at automatically (optional)

-- NOTE: This is a standalone SQL schema. If you intend to migrate an existing MongoDB dataset
-- to PostgreSQL, you'll need a migration plan. The current project uses MongoDB/Mongoose.
-- Use this as a relational model reference or to add an alternative SQL-backed implementation.
