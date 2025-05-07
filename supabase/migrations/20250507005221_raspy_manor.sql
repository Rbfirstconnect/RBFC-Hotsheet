/*
  # Update phone pricing
  
  1. Changes
    - Update port_in_price, non_port_price, and upgrade_price for pay now options
    - Update monthly_price and boost_protect for pay later options
    - Ensure all prices are properly formatted with 2 decimal places
*/

-- Update phone pricing for all phones
UPDATE phone_pricing
SET
  port_in_price = CASE
    WHEN phone_id IN (
      SELECT id FROM phones WHERE name LIKE '%iPhone%'
    ) THEN 299.99
    WHEN phone_id IN (
      SELECT id FROM phones WHERE name LIKE '%Samsung%'
    ) THEN 199.99
    ELSE 99.99
  END,
  non_port_price = CASE
    WHEN phone_id IN (
      SELECT id FROM phones WHERE name LIKE '%iPhone%'
    ) THEN 499.99
    WHEN phone_id IN (
      SELECT id FROM phones WHERE name LIKE '%Samsung%'
    ) THEN 399.99
    ELSE 199.99
  END,
  upgrade_price = CASE
    WHEN phone_id IN (
      SELECT id FROM phones WHERE name LIKE '%iPhone%'
    ) THEN 549.99
    WHEN phone_id IN (
      SELECT id FROM phones WHERE name LIKE '%Samsung%'
    ) THEN 449.99
    ELSE 249.99
  END,
  monthly_price = CASE
    WHEN phone_id IN (
      SELECT id FROM phones WHERE name LIKE '%iPhone%'
    ) THEN 24.99
    WHEN phone_id IN (
      SELECT id FROM phones WHERE name LIKE '%Samsung%'
    ) THEN 19.99
    ELSE 14.99
  END,
  boost_protect = CASE
    WHEN phone_id IN (
      SELECT id FROM phones WHERE name LIKE '%iPhone%' OR name LIKE '%Samsung S%'
    ) THEN 9.99
    ELSE 7.99
  END;

-- Update specific phones with special pricing
UPDATE phone_pricing
SET
  port_in_price = 0.00,
  non_port_price = 49.99,
  upgrade_price = 99.99,
  monthly_price = 12.99,
  boost_protect = 7.99
WHERE phone_id IN (
  SELECT id FROM phones 
  WHERE name LIKE '%Moto G%' 
  OR name LIKE '%A03s%'
  OR name LIKE '%A15%'
);

-- Set free phones
UPDATE phone_pricing
SET
  port_in_price = 0.00,
  non_port_price = 29.99,
  upgrade_price = 49.99,
  monthly_price = 9.99,
  boost_protect = 5.99
WHERE phone_id IN (
  SELECT id FROM phones 
  WHERE name LIKE '%Summit%'
  OR name LIKE '%Celero%'
);