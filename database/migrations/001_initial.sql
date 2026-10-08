CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE carrier (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text NOT NULL,
  tax_id varchar(14) NOT NULL UNIQUE CHECK (tax_id ~ '^[0-9]{14}$'),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','ACTIVE','REJECTED')),
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz
);
CREATE TABLE account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('ADMIN','MANAGER','DRIVER')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX account_email_normalized_unique ON account (lower(email));
CREATE TABLE administrator (
  account_id uuid PRIMARY KEY REFERENCES account(id) ON DELETE RESTRICT
);
CREATE TABLE manager (
  account_id uuid PRIMARY KEY REFERENCES account(id) ON DELETE RESTRICT,
  carrier_id uuid NOT NULL REFERENCES carrier(id) ON DELETE RESTRICT
);
CREATE INDEX idx_manager_carrier ON manager(carrier_id);
CREATE TABLE driver (
  account_id uuid PRIMARY KEY REFERENCES account(id) ON DELETE RESTRICT,
  carrier_id uuid NOT NULL REFERENCES carrier(id) ON DELETE RESTRICT,
  driver_license varchar(11) NOT NULL CHECK (driver_license ~ '^[0-9]{11}$'),
  UNIQUE(carrier_id,driver_license)
);
CREATE INDEX idx_driver_carrier ON driver(carrier_id);
CREATE TABLE refresh_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_session_account ON refresh_session(account_id);
CREATE TABLE vehicle (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id uuid NOT NULL REFERENCES carrier(id),
  plate varchar(7) NOT NULL UNIQUE,
  model text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_vehicle_carrier ON vehicle(carrier_id);
CREATE TABLE trip (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES driver(account_id),
  vehicle_id uuid NOT NULL REFERENCES vehicle(id),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  status text NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS','FINISHED')),
  CHECK ((status='IN_PROGRESS' AND ended_at IS NULL) OR (status='FINISHED' AND ended_at IS NOT NULL))
);
CREATE UNIQUE INDEX uq_active_trip_driver ON trip(driver_id) WHERE status='IN_PROGRESS';
CREATE UNIQUE INDEX uq_active_trip_vehicle ON trip(vehicle_id) WHERE status='IN_PROGRESS';
CREATE INDEX idx_trip_vehicle ON trip(vehicle_id);
CREATE TABLE vehicle_location (
  vehicle_id uuid PRIMARY KEY REFERENCES vehicle(id) ON DELETE CASCADE,
  latitude numeric(9,6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude numeric(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  recorded_at timestamptz NOT NULL
);
CREATE TABLE station (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude numeric(9,6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude numeric(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  is_affiliated boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_station_active_affiliated ON station(is_active,is_affiliated);
CREATE TABLE fuel_price (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id uuid NOT NULL REFERENCES station(id) ON DELETE RESTRICT,
  fuel_type text NOT NULL CHECK (fuel_type IN ('DIESEL_S10','DIESEL_S500','GASOLINE','ETHANOL','ARLA32')),
  price_per_liter numeric(10,3) NOT NULL CHECK (price_per_liter > 0),
  effective_from timestamptz NOT NULL DEFAULT now(),
  UNIQUE(station_id,fuel_type,effective_from)
);
CREATE INDEX idx_fuel_price_station_type_effective ON fuel_price(station_id,fuel_type,effective_from DESC);
CREATE TABLE fueling (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trip(id),
  station_id uuid NOT NULL REFERENCES station(id),
  fuel_type text NOT NULL,
  liters numeric(12,3) NOT NULL CHECK (liters > 0),
  unit_price numeric(10,3) NOT NULL CHECK (unit_price > 0),
  total_amount numeric(12,2) NOT NULL CHECK (total_amount > 0),
  status text NOT NULL DEFAULT 'AWAITING_APPROVAL' CHECK (status IN ('AWAITING_APPROVAL','APPROVED','REJECTED','PAID','PAYMENT_REJECTED','PAYMENT_UNKNOWN')),
  approved_by uuid REFERENCES manager(account_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz
);
CREATE INDEX idx_fueling_trip ON fueling(trip_id);
CREATE TABLE payment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fueling_id uuid NOT NULL UNIQUE REFERENCES fueling(id) ON DELETE RESTRICT,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  status text NOT NULL CHECK (status IN ('PROCESSING','APPROVED','REJECTED','UNKNOWN')),
  gateway_transaction_code text,
  idempotency_key text NOT NULL UNIQUE,
  gateway_message text,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE complaint (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_account_id uuid NOT NULL REFERENCES account(id),
  station_id uuid REFERENCES station(id),
  payment_id uuid REFERENCES payment(id),
  description text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','UNDER_REVIEW','RESOLVED','REJECTED')),
  verified_by_admin_id uuid REFERENCES administrator(account_id),
  moderation_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz,
  CONSTRAINT complaint_exclusive_target CHECK ((station_id IS NOT NULL) <> (payment_id IS NOT NULL))
);
CREATE INDEX idx_complaint_status ON complaint(status);
CREATE TABLE fcm_device (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE notification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES account(id),
  type text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','SENT','SIMULATED','FAILED')),
  attempts int NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);
CREATE INDEX idx_outbox_due ON notification(next_attempt_at) WHERE status IN ('PENDING','FAILED');
CREATE TABLE audit_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_account_id uuid REFERENCES account(id),
  carrier_id uuid REFERENCES carrier(id),
  resource text NOT NULL,
  resource_id uuid,
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_event_carrier_created ON audit_event(carrier_id,created_at DESC);
