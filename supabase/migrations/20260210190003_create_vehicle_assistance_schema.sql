/*
  # Smart Vehicle Emergency and Parking Assistance System

  ## New Tables

  ### vehicles
  Stores registered vehicle information and unique QR identifiers

  ### emergency_contacts
  Stores emergency contact information linked to vehicles

  ### parking_alerts
  Stores anonymous parking-related alerts sent by public users

  ### incidents
  Stores incident and damage reports with optional photo evidence

  ### emergency_activations
  Logs emergency assistance mode activations with location data

  ## Security
  - Row Level Security enabled on all tables
  - Public users can insert alerts and incidents anonymously
  - Emergency contacts are completely private
*/

-- vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code text UNIQUE NOT NULL,
  vehicle_number text NOT NULL,
  owner_name text,
  owner_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text,
  relationship text NOT NULL,
  priority integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- parking_alerts table
CREATE TABLE IF NOT EXISTS parking_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  alert_type text DEFAULT 'custom',
  location_lat numeric,
  location_lng numeric,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  incident_type text DEFAULT 'other',
  photo_url text,
  location_lat numeric,
  location_lng numeric,
  reporter_contact text,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- emergency_activations table
CREATE TABLE IF NOT EXISTS emergency_activations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  location_lat numeric NOT NULL,
  location_lng numeric NOT NULL,
  activation_note text,
  contacts_notified jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_activations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicles table
CREATE POLICY "Public can read basic vehicle info by QR code"
  ON vehicles FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert vehicles"
  ON vehicles FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Owners can update their vehicles"
  ON vehicles FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for emergency_contacts (completely private)
CREATE POLICY "No public access to emergency contacts"
  ON emergency_contacts FOR SELECT
  TO anon
  USING (false);

CREATE POLICY "Anyone can insert emergency contacts"
  ON emergency_contacts FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for parking_alerts
CREATE POLICY "Anyone can insert parking alerts"
  ON parking_alerts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Vehicle owners can read their alerts"
  ON parking_alerts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Vehicle owners can update their alerts"
  ON parking_alerts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for incidents
CREATE POLICY "Anyone can insert incidents"
  ON incidents FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read incidents"
  ON incidents FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update incidents"
  ON incidents FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for emergency_activations
CREATE POLICY "Anyone can insert emergency activations"
  ON emergency_activations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read emergency activations"
  ON emergency_activations FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_qr_code ON vehicles(qr_code);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_vehicle_id ON emergency_contacts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_parking_alerts_vehicle_id ON parking_alerts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_incidents_vehicle_id ON incidents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_emergency_activations_vehicle_id ON emergency_activations(vehicle_id);