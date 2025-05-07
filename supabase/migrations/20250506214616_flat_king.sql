/*
  # Add new phones
  
  1. New Data
    - Adds 35 new phones across different brands
    - Includes pricing, plans and promotions
    - Adds default images for each brand category
  
  2. Changes
    - Inserts new phones into phones table
    - Adds corresponding pricing in phone_pricing table
    - Creates plan associations in phone_plans table
    - Adds promotional offers for select phones
*/

-- Create temporary table to store phone mappings
CREATE TEMPORARY TABLE phone_id_map (
  string_id TEXT PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid()
);

-- Insert phone string IDs for new phones
INSERT INTO phone_id_map (string_id) VALUES
  ('iphone11-64'),
  ('iphone12-64'),
  ('iphone15-128'),
  ('iphone15-256'),
  ('iphone15-512'),
  ('iphone15-plus-256'),
  ('iphone15-pro-256'),
  ('iphone16-128'),
  ('iphone16-pro-max-256'),
  ('iphone15-pro-max-512'),
  ('iphone16e-128'),
  ('samsung-a36'),
  ('samsung-a03s'),
  ('samsung-a15-64'),
  ('samsung-a15-128'),
  ('samsung-a16'),
  ('samsung-a25'),
  ('samsung-a35'),
  ('samsung-s24-256'),
  ('samsung-s24-ultra-256'),
  ('samsung-s24-plus-256'),
  ('samsung-s25'),
  ('samsung-s25-plus'),
  ('samsung-s25-ultra'),
  ('samsung-z-flip-6'),
  ('moto-edge-plus-2023'),
  ('moto-g-stylus-5g-2024'),
  ('moto-g-5g-2024'),
  ('moto-razr-2024'),
  ('celero-5g-2024'),
  ('celero-5g-plus-2024'),
  ('celero-5g-sc'),
  ('summit-5g'),
  ('summit-flip'),
  ('tcl-tab-lite');

-- Insert phones
WITH phone_data AS (
  SELECT
    uuid,
    string_id,
    CASE string_id
      WHEN 'iphone11-64' THEN 'iPhone 11 64GB'
      WHEN 'iphone12-64' THEN 'iPhone 12 64GB'
      WHEN 'iphone15-128' THEN 'iPhone 15 128GB'
      WHEN 'iphone15-256' THEN 'iPhone 15 256GB'
      WHEN 'iphone15-512' THEN 'iPhone 15 512GB'
      WHEN 'iphone15-plus-256' THEN 'iPhone 15 Plus 256GB'
      WHEN 'iphone15-pro-256' THEN 'iPhone 15 Pro 256GB'
      WHEN 'iphone16-128' THEN 'iPhone 16 128GB'
      WHEN 'iphone16-pro-max-256' THEN 'iPhone 16 Pro Max 256GB'
      WHEN 'iphone15-pro-max-512' THEN 'iPhone 15 Pro Max 512GB'
      WHEN 'iphone16e-128' THEN 'iPhone 16e 128GB'
      WHEN 'samsung-a36' THEN 'Samsung A36'
      WHEN 'samsung-a03s' THEN 'Galaxy A03s'
      WHEN 'samsung-a15-64' THEN 'Samsung A15 5G 64GB'
      WHEN 'samsung-a15-128' THEN 'Samsung A15 5G 128GB'
      WHEN 'samsung-a16' THEN 'Samsung A16'
      WHEN 'samsung-a25' THEN 'Samsung A25'
      WHEN 'samsung-a35' THEN 'Samsung A35'
      WHEN 'samsung-s24-256' THEN 'Samsung Galaxy S24 256GB'
      WHEN 'samsung-s24-ultra-256' THEN 'Samsung Galaxy S24 Ultra 256GB'
      WHEN 'samsung-s24-plus-256' THEN 'Galaxy S24+ 256GB'
      WHEN 'samsung-s25' THEN 'Galaxy S25 128GB'
      WHEN 'samsung-s25-plus' THEN 'Galaxy S25+ 256GB'
      WHEN 'samsung-s25-ultra' THEN 'Galaxy S25 Ultra 256GB'
      WHEN 'samsung-z-flip-6' THEN 'Galaxy Z Flip 6 256GB'
      WHEN 'moto-edge-plus-2023' THEN 'Motorola Edge+ 2023'
      WHEN 'moto-g-stylus-5g-2024' THEN 'Moto G Stylus 5G 2024'
      WHEN 'moto-g-5g-2024' THEN 'Moto G 5G 2024'
      WHEN 'moto-razr-2024' THEN 'Motorola Razr 2024'
      WHEN 'celero-5g-2024' THEN 'Celero 5G 2024'
      WHEN 'celero-5g-plus-2024' THEN 'Celero 5G+ 2024'
      WHEN 'celero-5g-sc' THEN 'Celero 5G SC'
      WHEN 'summit-5g' THEN 'Summit 5G'
      WHEN 'summit-flip' THEN 'Summit Flip'
      WHEN 'tcl-tab-lite' THEN 'TCL Tab Lite (MBB)'
    END as name,
    CASE 
      WHEN string_id LIKE 'iphone%' THEN 'Apple'
      WHEN string_id LIKE 'samsung%' THEN 'Samsung'
      WHEN string_id LIKE 'moto%' THEN 'Motorola'
      WHEN string_id LIKE 'celero%' THEN 'Celero'
      WHEN string_id LIKE 'summit%' THEN 'Summit'
      WHEN string_id LIKE 'tcl%' THEN 'TCL'
    END as brand,
    'Black' as color,
    CASE 
      WHEN string_id LIKE '%64%' THEN '64GB'
      WHEN string_id LIKE '%128%' THEN '128GB'
      WHEN string_id LIKE '%256%' THEN '256GB'
      WHEN string_id LIKE '%512%' THEN '512GB'
      ELSE '128GB'
    END as storage,
    6.1 as screen_size,
    CASE string_id
      WHEN 'iphone11-64' THEN 499.99
      WHEN 'iphone12-64' THEN 549.99
      WHEN 'iphone15-128' THEN 729.99
      WHEN 'iphone15-256' THEN 829.99
      WHEN 'iphone15-512' THEN 1029.99
      WHEN 'iphone15-plus-256' THEN 929.99
      WHEN 'iphone15-pro-256' THEN 1099.99
      WHEN 'iphone16-128' THEN 829.99
      WHEN 'iphone16-pro-max-256' THEN 1199.99
      WHEN 'iphone15-pro-max-512' THEN 1399.99
      WHEN 'iphone16e-128' THEN 599.99
      WHEN 'samsung-a36' THEN 399.99
      WHEN 'samsung-a03s' THEN 119.99
      WHEN 'samsung-a15-64' THEN 169.99
      WHEN 'samsung-a15-128' THEN 199.99
      WHEN 'samsung-a16' THEN 199.99
      WHEN 'samsung-a25' THEN 299.99
      WHEN 'samsung-a35' THEN 399.99
      WHEN 'samsung-s24-256' THEN 859.99
      WHEN 'samsung-s24-ultra-256' THEN 1299.99
      WHEN 'samsung-s24-plus-256' THEN 999.99
      WHEN 'samsung-s25' THEN 799.99
      WHEN 'samsung-s25-plus' THEN 999.99
      WHEN 'samsung-s25-ultra' THEN 1299.99
      WHEN 'samsung-z-flip-6' THEN 1099.99
      WHEN 'moto-edge-plus-2023' THEN 599.99
      WHEN 'moto-g-stylus-5g-2024' THEN 269.99
      WHEN 'moto-g-5g-2024' THEN 149.99
      WHEN 'moto-razr-2024' THEN 599.99
      WHEN 'celero-5g-2024' THEN 159.99
      WHEN 'celero-5g-plus-2024' THEN 239.99
      WHEN 'celero-5g-sc' THEN 109.99
      WHEN 'summit-5g' THEN 94.99
      WHEN 'summit-flip' THEN 59.99
      WHEN 'tcl-tab-lite' THEN 119.99
    END as srp,
    CASE 
      WHEN string_id LIKE 'iphone%' THEN 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg'
      WHEN string_id LIKE 'samsung%' THEN 'https://images.pexels.com/photos/18069299/pexels-photo-18069299.jpeg'
      WHEN string_id LIKE 'moto%' THEN 'https://images.pexels.com/photos/14468677/pexels-photo-14468677.jpeg'
      ELSE 'https://images.pexels.com/photos/15351828/pexels-photo-15351828.jpeg'
    END as image_url
  FROM phone_id_map
)
INSERT INTO phones (id, name, brand, color, storage, screen_size, srp, image_url)
SELECT uuid, name, brand, color, storage, screen_size, srp, image_url
FROM phone_data;

-- Insert phone pricing
WITH pricing_data AS (
  SELECT
    uuid,
    string_id,
    CASE string_id
      WHEN 'iphone11-64' THEN 0
      WHEN 'iphone12-64' THEN 0
      WHEN 'iphone15-128' THEN 149.99
      WHEN 'iphone15-256' THEN NULL
      WHEN 'iphone15-512' THEN NULL
      WHEN 'iphone15-plus-256' THEN NULL
      WHEN 'iphone15-pro-256' THEN 619.99
      WHEN 'iphone16-128' THEN 449.99
      WHEN 'iphone16-pro-max-256' THEN 999.99
      WHEN 'iphone15-pro-max-512' THEN NULL
      WHEN 'iphone16e-128' THEN 199.99
      WHEN 'samsung-a36' THEN 69.99
      WHEN 'samsung-a03s' THEN 0
      WHEN 'samsung-a15-64' THEN 0
      WHEN 'samsung-a15-128' THEN 0
      WHEN 'samsung-a16' THEN 0
      WHEN 'samsung-a25' THEN 0
      WHEN 'samsung-a35' THEN 49.99
      WHEN 'samsung-s24-256' THEN 449.99
      WHEN 'samsung-s24-ultra-256' THEN 699.99
      WHEN 'samsung-s24-plus-256' THEN 399.99
      WHEN 'samsung-s25' THEN 299.99
      WHEN 'samsung-s25-plus' THEN 499.99
      WHEN 'samsung-s25-ultra' THEN 599.99
      WHEN 'samsung-z-flip-6' THEN NULL
      WHEN 'moto-edge-plus-2023' THEN 269.99
      WHEN 'moto-g-stylus-5g-2024' THEN 0
      WHEN 'moto-g-5g-2024' THEN 0
      WHEN 'moto-razr-2024' THEN 49.99
      WHEN 'celero-5g-2024' THEN 0
      WHEN 'celero-5g-plus-2024' THEN 49.99
      WHEN 'celero-5g-sc' THEN 0
      WHEN 'summit-5g' THEN 0
      WHEN 'summit-flip' THEN 29.99
      WHEN 'tcl-tab-lite' THEN NULL
    END as port_in_price,
    CASE string_id
      WHEN 'iphone11-64' THEN 49.99
      WHEN 'iphone12-64' THEN 49.99
      WHEN 'iphone15-128' THEN 249.99
      WHEN 'iphone15-256' THEN NULL
      WHEN 'iphone15-512' THEN NULL
      WHEN 'iphone15-plus-256' THEN NULL
      WHEN 'iphone15-pro-256' THEN 719.99
      WHEN 'iphone16-128' THEN 629.99
      WHEN 'iphone16-pro-max-256' THEN 999.99
      WHEN 'iphone15-pro-max-512' THEN NULL
      WHEN 'iphone16e-128' THEN 299.99
      WHEN 'samsung-a36' THEN 149.99
      WHEN 'samsung-a03s' THEN 15.00
      WHEN 'samsung-a15-64' THEN 0
      WHEN 'samsung-a15-128' THEN 15.00
      WHEN 'samsung-a16' THEN 25.00
      WHEN 'samsung-a25' THEN 79.99
      WHEN 'samsung-a35' THEN 149.99
      WHEN 'samsung-s24-256' THEN 859.99
      WHEN 'samsung-s24-ultra-256' THEN 999.99
      WHEN 'samsung-s24-plus-256' THEN 399.99
      WHEN 'samsung-s25' THEN 399.99
      WHEN 'samsung-s25-plus' THEN 599.99
      WHEN 'samsung-s25-ultra' THEN 799.99
      WHEN 'samsung-z-flip-6' THEN NULL
      WHEN 'moto-edge-plus-2023' THEN 269.99
      WHEN 'moto-g-stylus-5g-2024' THEN 49.99
      WHEN 'moto-g-5g-2024' THEN 0.99
      WHEN 'moto-razr-2024' THEN 149.99
      WHEN 'celero-5g-2024' THEN 29.99
      WHEN 'celero-5g-plus-2024' THEN 99.99
      WHEN 'celero-5g-sc' THEN 19.99
      WHEN 'summit-5g' THEN 10.00
      WHEN 'summit-flip' THEN 29.99
      WHEN 'tcl-tab-lite' THEN 0
    END as non_port_price,
    CASE string_id
      WHEN 'iphone11-64' THEN 49.99
      WHEN 'iphone12-64' THEN 49.99
      WHEN 'iphone15-128' THEN 249.99
      WHEN 'iphone15-256' THEN NULL
      WHEN 'iphone15-512' THEN NULL
      WHEN 'iphone15-plus-256' THEN NULL
      WHEN 'iphone15-pro-256' THEN 719.99
      WHEN 'iphone16-128' THEN 629.99
      WHEN 'iphone16-pro-max-256' THEN 999.99
      WHEN 'iphone15-pro-max-512' THEN NULL
      WHEN 'iphone16e-128' THEN 299.99
      WHEN 'samsung-a36' THEN 149.99
      WHEN 'samsung-a03s' THEN 59.99
      WHEN 'samsung-a15-64' THEN 15.00
      WHEN 'samsung-a15-128' THEN 15.00
      WHEN 'samsung-a16' THEN 25.00
      WHEN 'samsung-a25' THEN 79.99
      WHEN 'samsung-a35' THEN 149.99
      WHEN 'samsung-s24-256' THEN 859.99
      WHEN 'samsung-s24-ultra-256' THEN 999.99
      WHEN 'samsung-s24-plus-256' THEN 399.99
      WHEN 'samsung-s25' THEN 399.99
      WHEN 'samsung-s25-plus' THEN 599.99
      WHEN 'samsung-s25-ultra' THEN 799.99
      WHEN 'samsung-z-flip-6' THEN NULL
      WHEN 'moto-edge-plus-2023' THEN 269.99
      WHEN 'moto-g-stylus-5g-2024' THEN 25.00
      WHEN 'moto-g-5g-2024' THEN 0.99
      WHEN 'moto-razr-2024' THEN 199.99
      WHEN 'celero-5g-2024' THEN 29.99
      WHEN 'celero-5g-plus-2024' THEN 99.99
      WHEN 'celero-5g-sc' THEN 19.99
      WHEN 'summit-5g' THEN 19.99
      WHEN 'summit-flip' THEN 29.99
      WHEN 'tcl-tab-lite' THEN NULL
    END as upgrade_price,
    CASE string_id
      WHEN 'iphone11-64' THEN 13.89
      WHEN 'iphone12-64' THEN 15.28
      WHEN 'iphone15-128' THEN 20.28
      WHEN 'iphone15-256' THEN 23.06
      WHEN 'iphone15-512' THEN 28.61
      WHEN 'iphone15-plus-256' THEN 25.83
      WHEN 'iphone15-pro-256' THEN 30.56
      WHEN 'iphone16-128' THEN 23.06
      WHEN 'iphone16-pro-max-256' THEN 33.33
      WHEN 'iphone15-pro-max-512' THEN 38.89
      WHEN 'iphone16e-128' THEN 16.67
      WHEN 'samsung-a36' THEN 11.11
      WHEN 'samsung-a03s' THEN 3.33
      WHEN 'samsung-a15-64' THEN 4.72
      WHEN 'samsung-a15-128' THEN 5.56
      WHEN 'samsung-a16' THEN 5.56
      WHEN 'samsung-a25' THEN 8.33
      WHEN 'samsung-a35' THEN 11.11
      WHEN 'samsung-s24-256' THEN 23.89
      WHEN 'samsung-s24-ultra-256' THEN 36.11
      WHEN 'samsung-s24-plus-256' THEN 27.78
      WHEN 'samsung-s25' THEN 22.22
      WHEN 'samsung-s25-plus' THEN 27.78
      WHEN 'samsung-s25-ultra' THEN 36.11
      WHEN 'samsung-z-flip-6' THEN 30.56
      WHEN 'moto-edge-plus-2023' THEN 16.67
      WHEN 'moto-g-stylus-5g-2024' THEN 7.50
      WHEN 'moto-g-5g-2024' THEN 5.00
      WHEN 'moto-razr-2024' THEN 16.67
      WHEN 'celero-5g-2024' THEN 4.44
      WHEN 'celero-5g-plus-2024' THEN 6.67
      WHEN 'celero-5g-sc' THEN 3.06
      WHEN 'summit-5g' THEN 2.64
      WHEN 'summit-flip' THEN 1.67
      WHEN 'tcl-tab-lite' THEN 3.33
    END as monthly_price,
    CASE 
      WHEN string_id LIKE 'iphone%' THEN 12.00
      WHEN string_id LIKE 'samsung-s%' OR string_id LIKE 'samsung-z%' THEN 12.00
      ELSE 8.00
    END as boost_protect
  FROM phone_id_map
)
INSERT INTO phone_pricing (phone_id, port_in_price, non_port_price, upgrade_price, monthly_price, boost_protect)
SELECT uuid, port_in_price, non_port_price, upgrade_price, monthly_price, boost_protect
FROM pricing_data;

-- Insert phone plans
WITH plan_combinations AS (
  SELECT 
    m.uuid as phone_id,
    p.price as plan_price,
    t.type as plan_type
  FROM phone_id_map m
  CROSS JOIN (VALUES (25), (50), (60)) p(price)
  CROSS JOIN (VALUES ('port_in'), ('pay_later')) t(type)
)
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT phone_id, plan_price, plan_type
FROM plan_combinations;

-- Insert promotions
INSERT INTO phone_promotions (phone_id, promotion_type, promotion_text, valid_from, valid_to)
SELECT 
  m.uuid,
  'SALE',
  CASE m.string_id
    WHEN 'iphone13-128' THEN 'FREE after bill credits'
    WHEN 'samsung-a15-64' THEN '*Non CIP $25 on $50, $60 plans'
    WHEN 'iphone16-128' THEN '*$429 after $200 in bill credits'
  END,
  '2024-02-18',
  '2024-04-21'
FROM phone_id_map m
WHERE m.string_id IN ('iphone13-128', 'samsung-a15-64', 'iphone16-128');

-- Clean up
DROP TABLE phone_id_map;