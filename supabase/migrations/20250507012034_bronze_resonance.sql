/*
  # Combine Phone Tables

  1. Create new comprehensive phone_details table
  2. Migrate data from existing tables
  3. Add appropriate constraints and indexes
  4. Enable RLS
*/

-- Create new comprehensive table
CREATE TABLE IF NOT EXISTS phone_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Basic phone info
  name text NOT NULL,
  brand text NOT NULL,
  color text NOT NULL,
  storage text NOT NULL,
  screen_size numeric NOT NULL,
  srp numeric NOT NULL,
  image_url text NOT NULL,
  -- Pricing info
  port_in_price numeric,
  non_port_price numeric,
  upgrade_price numeric,
  monthly_price numeric,
  boost_protect numeric,
  -- Plans
  available_plans jsonb DEFAULT '[]',
  -- Promotion
  promotion_type text CHECK (promotion_type IN ('SALE', 'BOGO', 'DEAL')),
  promotion_text text,
  promotion_valid_from date,
  promotion_valid_to date,
  -- Specifications
  specifications jsonb DEFAULT '{}',
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Migrate data from existing tables
INSERT INTO phone_details (
  id,
  name,
  brand,
  color,
  storage,
  screen_size,
  srp,
  image_url,
  port_in_price,
  non_port_price,
  upgrade_price,
  monthly_price,
  boost_protect,
  available_plans,
  promotion_type,
  promotion_text,
  promotion_valid_from,
  promotion_valid_to,
  specifications
)
SELECT
  p.id,
  p.name,
  p.brand,
  p.color,
  p.storage,
  p.screen_size,
  p.srp,
  p.image_url,
  pp.port_in_price,
  pp.non_port_price,
  pp.upgrade_price,
  pp.monthly_price,
  pp.boost_protect,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'price', plan_price,
        'type', plan_type
      )
    )
    FROM phone_plans pl
    WHERE pl.phone_id = p.id
  ) as available_plans,
  (
    SELECT promotion_type
    FROM phone_promotions pr
    WHERE pr.phone_id = p.id
    LIMIT 1
  ) as promotion_type,
  (
    SELECT promotion_text
    FROM phone_promotions pr
    WHERE pr.phone_id = p.id
    LIMIT 1
  ) as promotion_text,
  (
    SELECT valid_from
    FROM phone_promotions pr
    WHERE pr.phone_id = p.id
    LIMIT 1
  ) as promotion_valid_from,
  (
    SELECT valid_to
    FROM phone_promotions pr
    WHERE pr.phone_id = p.id
    LIMIT 1
  ) as promotion_valid_to,
  (
    SELECT jsonb_object_agg(
      category,
      jsonb_build_object(
        'key', spec_key,
        'value', spec_value
      )
    )
    FROM phone_specifications ps
    WHERE ps.phone_id = p.id
  ) as specifications
FROM phones p
LEFT JOIN phone_pricing pp ON p.id = pp.phone_id;

-- Add indexes
CREATE INDEX idx_phone_details_brand ON phone_details(brand);
CREATE INDEX idx_phone_details_storage ON phone_details(storage);
CREATE INDEX idx_phone_details_price_range ON phone_details(port_in_price, monthly_price);
CREATE INDEX idx_phone_details_promotion ON phone_details(promotion_type) WHERE promotion_type IS NOT NULL;

-- Enable RLS
ALTER TABLE phone_details ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Public can view phone details"
  ON phone_details
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage phone details"
  ON phone_details
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  ));

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_phone_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_phone_details_updated_at
  BEFORE UPDATE ON phone_details
  FOR EACH ROW
  EXECUTE FUNCTION update_phone_details_updated_at();

-- Drop old tables
DROP TABLE IF EXISTS phone_specifications CASCADE;
DROP TABLE IF EXISTS phone_promotions CASCADE;
DROP TABLE IF EXISTS phone_plans CASCADE;
DROP TABLE IF EXISTS phone_pricing CASCADE;
DROP TABLE IF EXISTS phones CASCADE;