/*
  # Phone Shop Database Schema

  1. New Tables
    - `phones`
      - Basic phone information (id, name, brand, etc.)
    - `phone_pricing`
      - Pay now and pay later pricing options
    - `phone_plans`
      - Available plans for each phone
    - `phone_promotions`
      - Active promotions for phones
    - `phone_specifications`
      - Detailed phone specifications
    - `phone_bundles`
      - Available accessory bundles
    - `bundle_items`
      - Items included in each bundle

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
    - Add policies for admin users to manage data
*/

-- Create phones table
CREATE TABLE IF NOT EXISTS phones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  color text NOT NULL,
  storage text NOT NULL,
  screen_size numeric NOT NULL,
  srp numeric NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create phone_pricing table
CREATE TABLE IF NOT EXISTS phone_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_id uuid REFERENCES phones(id) ON DELETE CASCADE,
  port_in_price numeric,
  non_port_price numeric,
  upgrade_price numeric,
  monthly_price numeric,
  boost_protect numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create phone_plans table
CREATE TABLE IF NOT EXISTS phone_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_id uuid REFERENCES phones(id) ON DELETE CASCADE,
  plan_price numeric NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('port_in', 'pay_later')),
  created_at timestamptz DEFAULT now()
);

-- Create phone_promotions table
CREATE TABLE IF NOT EXISTS phone_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_id uuid REFERENCES phones(id) ON DELETE CASCADE,
  promotion_type text NOT NULL CHECK (promotion_type IN ('SALE', 'BOGO', 'DEAL')),
  promotion_text text NOT NULL,
  valid_from date NOT NULL,
  valid_to date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create phone_specifications table
CREATE TABLE IF NOT EXISTS phone_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_id uuid REFERENCES phones(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('general', 'display', 'camera', 'performance', 'battery', 'connectivity')),
  spec_key text NOT NULL,
  spec_value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create phone_bundles table
CREATE TABLE IF NOT EXISTS phone_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bundle_items table
CREATE TABLE IF NOT EXISTS bundle_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid REFERENCES phone_bundles(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;

-- Create policies for reading data
CREATE POLICY "Anyone can read phones" ON phones
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read phone pricing" ON phone_pricing
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read phone plans" ON phone_plans
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read phone promotions" ON phone_promotions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read phone specifications" ON phone_specifications
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read phone bundles" ON phone_bundles
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read bundle items" ON bundle_items
  FOR SELECT USING (true);

-- Create policies for managing data (admin only)
CREATE POLICY "Admin can manage phones" ON phones
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Admin can manage phone pricing" ON phone_pricing
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Admin can manage phone plans" ON phone_plans
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Admin can manage phone promotions" ON phone_promotions
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Admin can manage phone specifications" ON phone_specifications
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Admin can manage phone bundles" ON phone_bundles
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Admin can manage bundle items" ON bundle_items
  FOR ALL USING (auth.role() = 'admin');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at
CREATE TRIGGER update_phones_updated_at
  BEFORE UPDATE ON phones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phone_pricing_updated_at
  BEFORE UPDATE ON phone_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phone_promotions_updated_at
  BEFORE UPDATE ON phone_promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();