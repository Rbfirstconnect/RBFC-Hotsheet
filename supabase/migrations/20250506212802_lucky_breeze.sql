/*
  # Import phone data
  
  1. New Data
    - Imports all phone data from the existing application
    - Creates phone records with pricing, plans, promotions, and bundles
    
  2. Structure
    - Uses temporary mapping table for ID relationships
    - Maintains referential integrity with UUIDs
    - Properly handles date formats for promotions
    
  3. Security
    - No changes to existing RLS policies
*/

-- Create temporary table to store phone mappings
CREATE TEMPORARY TABLE phone_id_map (
  string_id TEXT PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid()
);

-- Insert phone string IDs
INSERT INTO phone_id_map (string_id) VALUES
  ('iphone-13'),
  ('samsung-galaxy-s23'),
  ('moto-edge-2023'),
  ('iphone-14-pro'),
  ('samsung-galaxy-a54'),
  ('moto-g-stylus');

-- Insert phones using UUID mapping
INSERT INTO phones (id, name, brand, color, storage, screen_size, srp, image_url)
SELECT 
  m.uuid,
  CASE m.string_id
    WHEN 'iphone-13' THEN 'iPhone 13'
    WHEN 'samsung-galaxy-s23' THEN 'Samsung Galaxy S23'
    WHEN 'moto-edge-2023' THEN 'Motorola Edge (2023)'
    WHEN 'iphone-14-pro' THEN 'iPhone 14 Pro'
    WHEN 'samsung-galaxy-a54' THEN 'Samsung Galaxy A54'
    WHEN 'moto-g-stylus' THEN 'Moto G Stylus'
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 'Apple'
    WHEN 'samsung-galaxy-s23' THEN 'Samsung'
    WHEN 'moto-edge-2023' THEN 'Motorola'
    WHEN 'iphone-14-pro' THEN 'Apple'
    WHEN 'samsung-galaxy-a54' THEN 'Samsung'
    WHEN 'moto-g-stylus' THEN 'Motorola'
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 'Midnight'
    WHEN 'samsung-galaxy-s23' THEN 'Phantom Black'
    WHEN 'moto-edge-2023' THEN 'Nebula Blue'
    WHEN 'iphone-14-pro' THEN 'Deep Purple'
    WHEN 'samsung-galaxy-a54' THEN 'Awesome Violet'
    WHEN 'moto-g-stylus' THEN 'Cosmic Black'
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN '128GB'
    WHEN 'samsung-galaxy-s23' THEN '256GB'
    WHEN 'moto-edge-2023' THEN '128GB'
    WHEN 'iphone-14-pro' THEN '256GB'
    WHEN 'samsung-galaxy-a54' THEN '128GB'
    WHEN 'moto-g-stylus' THEN '128GB'
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 6.1
    WHEN 'samsung-galaxy-s23' THEN 6.8
    WHEN 'moto-edge-2023' THEN 6.6
    WHEN 'iphone-14-pro' THEN 6.1
    WHEN 'samsung-galaxy-a54' THEN 6.4
    WHEN 'moto-g-stylus' THEN 6.8
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 599.99
    WHEN 'samsung-galaxy-s23' THEN 799.99
    WHEN 'moto-edge-2023' THEN 499.99
    WHEN 'iphone-14-pro' THEN 899.99
    WHEN 'samsung-galaxy-a54' THEN 399.99
    WHEN 'moto-g-stylus' THEN 299.99
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg'
    WHEN 'samsung-galaxy-s23' THEN 'https://images.pexels.com/photos/18069299/pexels-photo-18069299.jpeg'
    WHEN 'moto-edge-2023' THEN 'https://images.pexels.com/photos/14468677/pexels-photo-14468677.jpeg'
    WHEN 'iphone-14-pro' THEN 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg'
    WHEN 'samsung-galaxy-a54' THEN 'https://images.pexels.com/photos/16975318/pexels-photo-16975318.jpeg'
    WHEN 'moto-g-stylus' THEN 'https://images.pexels.com/photos/15351828/pexels-photo-15351828.jpeg'
  END
FROM phone_id_map m;

-- Insert phone pricing
INSERT INTO phone_pricing (phone_id, port_in_price, non_port_price, upgrade_price, monthly_price, boost_protect)
SELECT 
  m.uuid,
  CASE m.string_id
    WHEN 'iphone-13' THEN 299.99
    WHEN 'samsung-galaxy-s23' THEN 599.99
    WHEN 'moto-edge-2023' THEN 0
    WHEN 'iphone-14-pro' THEN 699.99
    WHEN 'samsung-galaxy-a54' THEN 99.99
    WHEN 'moto-g-stylus' THEN 49.99
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 499.99
    WHEN 'samsung-galaxy-s23' THEN 699.99
    WHEN 'moto-edge-2023' THEN 249.99
    WHEN 'iphone-14-pro' THEN 799.99
    WHEN 'samsung-galaxy-a54' THEN 299.99
    WHEN 'moto-g-stylus' THEN 149.99
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 549.99
    WHEN 'samsung-galaxy-s23' THEN 749.99
    WHEN 'moto-edge-2023' THEN 349.99
    WHEN 'iphone-14-pro' THEN 849.99
    WHEN 'samsung-galaxy-a54' THEN 349.99
    WHEN 'moto-g-stylus' THEN 199.99
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 24.99
    WHEN 'samsung-galaxy-s23' THEN 29.99
    WHEN 'moto-edge-2023' THEN 14.99
    WHEN 'iphone-14-pro' THEN 37.49
    WHEN 'samsung-galaxy-a54' THEN 16.66
    WHEN 'moto-g-stylus' THEN 12.49
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 7.99
    WHEN 'samsung-galaxy-s23' THEN 8.99
    WHEN 'moto-edge-2023' THEN 5.99
    WHEN 'iphone-14-pro' THEN 9.99
    WHEN 'samsung-galaxy-a54' THEN 6.99
    WHEN 'moto-g-stylus' THEN 5.99
  END
FROM phone_id_map m;

-- Insert phone plans
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT m.uuid, 50, 'port_in' FROM phone_id_map m;
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT m.uuid, 60, 'port_in' FROM phone_id_map m;
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT m.uuid, 50, 'pay_later' FROM phone_id_map m;
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT m.uuid, 60, 'pay_later' FROM phone_id_map m;

-- Additional $25 plans for specific phones
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT m.uuid, 25, 'port_in'
FROM phone_id_map m
WHERE m.string_id IN ('moto-edge-2023', 'samsung-galaxy-a54', 'moto-g-stylus');

INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT m.uuid, 25, 'pay_later'
FROM phone_id_map m
WHERE m.string_id IN ('moto-edge-2023', 'samsung-galaxy-a54', 'moto-g-stylus');

-- Insert phone promotions
INSERT INTO phone_promotions (phone_id, promotion_type, promotion_text, valid_from, valid_to)
SELECT 
  m.uuid,
  CASE m.string_id
    WHEN 'iphone-13' THEN 'SALE'
    WHEN 'moto-edge-2023' THEN 'BOGO'
    WHEN 'samsung-galaxy-a54' THEN 'DEAL'
  END,
  CASE m.string_id
    WHEN 'iphone-13' THEN 'Get 50% off when you port your number to Boost Mobile!'
    WHEN 'moto-edge-2023' THEN 'Buy one Motorola Edge, get one FREE when you add a line!'
    WHEN 'samsung-galaxy-a54' THEN 'Switch to Boost and get this phone for just $99.99!'
  END,
  DATE '2025-01-01',
  CASE m.string_id
    WHEN 'moto-edge-2023' THEN DATE '2025-06-30'
    ELSE DATE '2025-12-31'
  END
FROM phone_id_map m
WHERE m.string_id IN ('iphone-13', 'moto-edge-2023', 'samsung-galaxy-a54');

-- Insert phone bundles
INSERT INTO phone_bundles (name, price) VALUES
  ('Tier 1', 35),
  ('Tier 2', 45),
  ('Tier 3', 60),
  ('Tier 4', 100);

-- Insert bundle items
WITH bundle_ids AS (
  SELECT id, name FROM phone_bundles
)
INSERT INTO bundle_items (bundle_id, item_name)
SELECT 
  b.id,
  item_name
FROM bundle_ids b
CROSS JOIN (
  VALUES
    ('Tier 1', 'Charging Block'),
    ('Tier 1', 'Screen Protector'),
    ('Tier 2', 'Case'),
    ('Tier 2', 'Screen Protector'),
    ('Tier 3', 'Screen Protector'),
    ('Tier 3', 'Case'),
    ('Tier 3', 'Power Block'),
    ('Tier 4', 'Screen Protector'),
    ('Tier 4', 'Case'),
    ('Tier 4', 'Power Block'),
    ('Tier 4', 'Base Audio Headphone/Speaker')
) AS items(bundle_name, item_name)
WHERE b.name = items.bundle_name;

-- Clean up temporary table
DROP TABLE phone_id_map;