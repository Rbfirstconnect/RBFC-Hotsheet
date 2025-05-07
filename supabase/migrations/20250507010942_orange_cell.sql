/*
  # Update Phone Pricing
  
  1. Changes
    - Create phone_pricing table if not exists
    - Update monthly payment prices
    - Add boost protect values
    - Verify all updates
*/

-- Create phone_pricing table if it doesn't exist
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

-- Insert initial pricing data if not exists
INSERT INTO phone_pricing (phone_id, monthly_price, boost_protect)
SELECT 
  id as phone_id,
  CASE
    -- iPhones
    WHEN name = 'iPhone 11 64GB' THEN 13.89
    WHEN name = 'iPhone 12 64GB' THEN 15.28
    WHEN name = 'iPhone 13 128GB' THEN 17.50
    WHEN name = 'iPhone 15 128GB' THEN 20.28
    WHEN name = 'iPhone 15 256GB' THEN 23.06
    WHEN name = 'iPhone 15 512GB' THEN 28.61
    WHEN name = 'iPhone 15 Plus 256GB' THEN 25.83
    WHEN name = 'iPhone 15 Pro 256GB' THEN 30.56
    WHEN name = 'iPhone 16 128GB' THEN 23.06
    WHEN name = 'iPhone 16 Pro Max 256GB' THEN 33.33
    WHEN name = 'iPhone 15 Pro Max 512GB' THEN 38.89
    WHEN name = 'iPhone 16e 128GB' THEN 16.67
    -- Samsung
    WHEN name = 'Samsung A36' THEN 11.11
    WHEN name = 'Samsung A03s' THEN 3.33
    WHEN name = 'Samsung A15 5G 64GB' THEN 4.72
    WHEN name = 'Samsung A15 5G 128GB' THEN 5.56
    WHEN name = 'Samsung A16' THEN 5.56
    WHEN name = 'Samsung A25' THEN 8.33
    WHEN name = 'Samsung A35' THEN 11.11
    WHEN name = 'Samsung Galaxy S24 256GB' THEN 23.89
    WHEN name = 'Samsung Galaxy S24 Ultra 256GB' THEN 36.11
    WHEN name = 'Galaxy S24+ 256GB' THEN 27.78
    WHEN name = 'Galaxy S25' THEN 22.22
    WHEN name = 'Galaxy S25+ 256GB' THEN 27.78
    WHEN name = 'Galaxy S25 Ultra 256GB' THEN 36.11
    WHEN name = 'Galaxy Z Flip 6 256GB' THEN 30.56
    -- Motorola
    WHEN name = 'Motorola Edge 2023' THEN 10.00
    WHEN name = 'Motorola Edge+ 2023' THEN 16.67
    WHEN name = 'Moto G Stylus 5G 2024' THEN 7.50
    WHEN name = 'Moto G 5G 2024' THEN 5.00
    WHEN name = 'Motorola Razr 2024' THEN 16.67
    -- Others
    WHEN name = 'Celero 5G 2024' THEN 4.44
    WHEN name = 'Celero 5G+ 2024' THEN 6.67
    WHEN name = 'Celero 5G SC' THEN 3.06
    WHEN name = 'Summit 5G' THEN 2.64
    WHEN name = 'Summit Flip' THEN 1.67
    WHEN name = 'TCL Tab Lite (MBB)' THEN 3.33
  END as monthly_price,
  CASE 
    WHEN brand = 'Apple' THEN 12.00
    WHEN name LIKE 'Samsung Galaxy S%' OR name LIKE 'Samsung Galaxy Z%' THEN 12.00
    ELSE 8.00
  END as boost_protect
FROM phones
WHERE NOT EXISTS (
  SELECT 1 FROM phone_pricing WHERE phone_pricing.phone_id = phones.id
);

-- Update existing monthly prices
UPDATE phone_pricing pp
SET monthly_price = (
  SELECT 
    CASE
      -- iPhones
      WHEN p.name = 'iPhone 11 64GB' THEN 13.89
      WHEN p.name = 'iPhone 12 64GB' THEN 15.28
      WHEN p.name = 'iPhone 13 128GB' THEN 17.50
      WHEN p.name = 'iPhone 15 128GB' THEN 20.28
      WHEN p.name = 'iPhone 15 256GB' THEN 23.06
      WHEN p.name = 'iPhone 15 512GB' THEN 28.61
      WHEN p.name = 'iPhone 15 Plus 256GB' THEN 25.83
      WHEN p.name = 'iPhone 15 Pro 256GB' THEN 30.56
      WHEN p.name = 'iPhone 16 128GB' THEN 23.06
      WHEN p.name = 'iPhone 16 Pro Max 256GB' THEN 33.33
      WHEN p.name = 'iPhone 15 Pro Max 512GB' THEN 38.89
      WHEN p.name = 'iPhone 16e 128GB' THEN 16.67
      -- Samsung
      WHEN p.name = 'Samsung A36' THEN 11.11
      WHEN p.name = 'Samsung A03s' THEN 3.33
      WHEN p.name = 'Samsung A15 5G 64GB' THEN 4.72
      WHEN p.name = 'Samsung A15 5G 128GB' THEN 5.56
      WHEN p.name = 'Samsung A16' THEN 5.56
      WHEN p.name = 'Samsung A25' THEN 8.33
      WHEN p.name = 'Samsung A35' THEN 11.11
      WHEN p.name = 'Samsung Galaxy S24 256GB' THEN 23.89
      WHEN p.name = 'Samsung Galaxy S24 Ultra 256GB' THEN 36.11
      WHEN p.name = 'Galaxy S24+ 256GB' THEN 27.78
      WHEN p.name = 'Galaxy S25' THEN 22.22
      WHEN p.name = 'Galaxy S25+ 256GB' THEN 27.78
      WHEN p.name = 'Galaxy S25 Ultra 256GB' THEN 36.11
      WHEN p.name = 'Galaxy Z Flip 6 256GB' THEN 30.56
      -- Motorola
      WHEN p.name = 'Motorola Edge 2023' THEN 10.00
      WHEN p.name = 'Motorola Edge+ 2023' THEN 16.67
      WHEN p.name = 'Moto G Stylus 5G 2024' THEN 7.50
      WHEN p.name = 'Moto G 5G 2024' THEN 5.00
      WHEN p.name = 'Motorola Razr 2024' THEN 16.67
      -- Others
      WHEN p.name = 'Celero 5G 2024' THEN 4.44
      WHEN p.name = 'Celero 5G+ 2024' THEN 6.67
      WHEN p.name = 'Celero 5G SC' THEN 3.06
      WHEN p.name = 'Summit 5G' THEN 2.64
      WHEN p.name = 'Summit Flip' THEN 1.67
      WHEN p.name = 'TCL Tab Lite (MBB)' THEN 3.33
      ELSE pp.monthly_price
    END
  FROM phones p
  WHERE p.id = pp.phone_id
)
WHERE EXISTS (
  SELECT 1 FROM phones p
  WHERE p.id = pp.phone_id
);

-- Update boost protect values
UPDATE phone_pricing pp
SET boost_protect = (
  SELECT 
    CASE 
      WHEN p.brand = 'Apple' THEN 12.00
      WHEN p.name LIKE 'Samsung Galaxy S%' OR p.name LIKE 'Samsung Galaxy Z%' THEN 12.00
      ELSE 8.00
    END
  FROM phones p
  WHERE p.id = pp.phone_id
)
WHERE EXISTS (
  SELECT 1 FROM phones p
  WHERE p.id = pp.phone_id
);

-- Verify the updates
SELECT 
  p.brand,
  p.name,
  pp.monthly_price,
  pp.boost_protect
FROM phones p
JOIN phone_pricing pp ON p.id = pp.phone_id
ORDER BY p.brand, p.name;