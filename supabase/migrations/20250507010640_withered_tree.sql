/*
  # Update device financing prices
  
  1. Changes
    - Updates monthly payment amounts for all phones
    - Sets correct Boost Protect fees based on device tier
    - Ensures all phones have proper financing options
*/

-- Update iPhone financing prices
UPDATE phone_pricing
SET monthly_price = (
  CASE 
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 11 64GB') THEN 13.89
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 12 64GB') THEN 15.28
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 13 128GB') THEN 17.50
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 128GB') THEN 20.28
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 256GB') THEN 23.06
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 512GB') THEN 28.61
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 Plus 256GB') THEN 25.83
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 Pro 256GB') THEN 30.56
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 128GB') THEN 23.06
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 Pro Max 256GB') THEN 33.33
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 Pro Max 512GB') THEN 38.89
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16e 128GB') THEN 16.67
  END
)
WHERE phone_id IN (SELECT id FROM phones WHERE brand = 'Apple');

-- Update Samsung financing prices
UPDATE phone_pricing
SET monthly_price = (
  CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A36') THEN 11.11
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A03s') THEN 3.33
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 64GB') THEN 4.72
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 128GB') THEN 5.56
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A16') THEN 5.56
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A25') THEN 8.33
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A35') THEN 11.11
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 256GB') THEN 23.89
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 Ultra 256GB') THEN 36.11
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Galaxy S24+ 256GB') THEN 27.78
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Galaxy S25') THEN 22.22
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Galaxy S25+ 256GB') THEN 27.78
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Galaxy S25 Ultra 256GB') THEN 36.11
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Galaxy Z Flip 6 256GB') THEN 30.56
  END
)
WHERE phone_id IN (SELECT id FROM phones WHERE brand = 'Samsung');

-- Update Motorola financing prices
UPDATE phone_pricing
SET monthly_price = (
  CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge 2023') THEN 10.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge+ 2023') THEN 16.67
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G Stylus 5G 2024') THEN 7.50
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G 5G 2024') THEN 5.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Razr 2024') THEN 16.67
  END
)
WHERE phone_id IN (SELECT id FROM phones WHERE brand = 'Motorola');

-- Update other brands financing prices
UPDATE phone_pricing
SET monthly_price = (
  CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G 2024') THEN 4.44
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G+ 2024') THEN 6.67
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G SC') THEN 3.06
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit 5G') THEN 2.64
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit Flip') THEN 1.67
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'TCL Tab Lite (MBB)') THEN 3.33
  END
)
WHERE phone_id IN (
  SELECT id FROM phones 
  WHERE brand IN ('Celero', 'Summit', 'TCL')
);

-- Update Boost Protect fees
UPDATE phone_pricing
SET boost_protect = (
  CASE
    -- Premium devices get higher protection fee
    WHEN phone_id IN (
      SELECT id FROM phones 
      WHERE (brand = 'Apple' AND name LIKE '%Pro%')
      OR (brand = 'Samsung' AND (name LIKE '%S24%' OR name LIKE '%S25%' OR name LIKE '%Ultra%' OR name LIKE '%Flip%'))
    ) THEN 15.00
    -- Standard iPhone models
    WHEN phone_id IN (
      SELECT id FROM phones 
      WHERE brand = 'Apple'
    ) THEN 12.00
    -- All other devices
    ELSE 8.00
  END
);