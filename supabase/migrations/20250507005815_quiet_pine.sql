/*
  # Update phone pricing and plans
  
  1. Changes
    - Clear existing phone plans
    - Update pricing for all phones
    - Insert new plans for all phones
    
  2. Structure
    - Update pricing table first
    - Insert plans after pricing is updated
    - Handle special cases for different phone types
*/

-- First, clear existing phone plans to avoid duplicates
DELETE FROM phone_plans;

-- Update iPhone pricing
UPDATE phone_pricing
SET
  port_in_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 11 64GB') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 12 64GB') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 13 128GB') THEN 49.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 128GB') THEN 149.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 Pro 256GB') THEN 619.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 128GB') THEN 449.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 Pro Max 256GB') THEN 999.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16e 128GB') THEN 199.99
    ELSE port_in_price
  END,
  non_port_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 11 64GB') THEN 49.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 12 64GB') THEN 49.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 13 128GB') THEN 149.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 128GB') THEN 249.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 Pro 256GB') THEN 719.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 128GB') THEN 629.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 Pro Max 256GB') THEN 999.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16e 128GB') THEN 299.99
    ELSE non_port_price
  END,
  upgrade_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 11 64GB') THEN 49.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 12 64GB') THEN 49.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 13 128GB') THEN 149.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 128GB') THEN 249.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 Pro 256GB') THEN 719.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 128GB') THEN 629.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 Pro Max 256GB') THEN 999.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16e 128GB') THEN 299.99
    ELSE upgrade_price
  END,
  monthly_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 11 64GB') THEN 13.89
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 12 64GB') THEN 15.28
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 13 128GB') THEN 17.50
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 128GB') THEN 20.28
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 15 Pro 256GB') THEN 30.56
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 128GB') THEN 23.06
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16 Pro Max 256GB') THEN 33.33
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'iPhone 16e 128GB') THEN 16.67
    ELSE monthly_price
  END,
  boost_protect = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name LIKE '%Pro%') THEN 15.00
    ELSE 12.00
  END
WHERE phone_id IN (SELECT id FROM phones WHERE brand = 'Apple');

-- Update Samsung pricing
UPDATE phone_pricing
SET
  port_in_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A03s') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 64GB') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 128GB') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A16') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A25') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A35') THEN 49.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 256GB') THEN 449.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 Ultra 256GB') THEN 699.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Galaxy S24+ 256GB') THEN 399.99
    ELSE port_in_price
  END,
  non_port_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A03s') THEN 15.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 64GB') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 128GB') THEN 15.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A16') THEN 25.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A25') THEN 79.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A35') THEN 149.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 256GB') THEN 859.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 Ultra 256GB') THEN 999.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Galaxy S24+ 256GB') THEN 399.99
    ELSE non_port_price
  END,
  upgrade_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A03s') THEN 59.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 64GB') THEN 15.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 128GB') THEN 15.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A16') THEN 25.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A25') THEN 79.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A35') THEN 149.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 256GB') THEN 859.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 Ultra 256GB') THEN 999.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Galaxy S24+ 256GB') THEN 399.99
    ELSE upgrade_price
  END,
  monthly_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A03s') THEN 3.33
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 64GB') THEN 4.72
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A15 5G 128GB') THEN 5.56
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A16') THEN 5.56
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A25') THEN 8.33
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung A35') THEN 11.11
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 256GB') THEN 23.89
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Samsung Galaxy S24 Ultra 256GB') THEN 36.11
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Galaxy S24+ 256GB') THEN 27.78
    ELSE monthly_price
  END,
  boost_protect = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name LIKE '%S24%' OR name LIKE '%Ultra%') THEN 12.00
    ELSE 8.00
  END
WHERE phone_id IN (SELECT id FROM phones WHERE brand = 'Samsung');

-- Update Motorola pricing
UPDATE phone_pricing
SET
  port_in_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge 2023') THEN 49.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge+ 2023') THEN 269.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G Stylus 5G 2024') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G 5G 2024') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Razr 2024') THEN 49.99
    ELSE port_in_price
  END,
  non_port_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge 2023') THEN 79.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge+ 2023') THEN 269.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G Stylus 5G 2024') THEN 49.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G 5G 2024') THEN 0.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Razr 2024') THEN 149.99
    ELSE non_port_price
  END,
  upgrade_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge 2023') THEN 79.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge+ 2023') THEN 269.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G Stylus 5G 2024') THEN 25.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G 5G 2024') THEN 0.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Razr 2024') THEN 199.99
    ELSE upgrade_price
  END,
  monthly_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge 2023') THEN 10.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Edge+ 2023') THEN 16.67
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G Stylus 5G 2024') THEN 7.50
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Moto G 5G 2024') THEN 5.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Motorola Razr 2024') THEN 16.67
    ELSE monthly_price
  END,
  boost_protect = 8.00
WHERE phone_id IN (SELECT id FROM phones WHERE brand = 'Motorola');

-- Update other phones pricing
UPDATE phone_pricing
SET
  port_in_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G 2024') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G+ 2024') THEN 49.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G SC') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit 5G') THEN 0.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit Flip') THEN 29.99
    ELSE port_in_price
  END,
  non_port_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G 2024') THEN 29.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G+ 2024') THEN 99.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G SC') THEN 19.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit 5G') THEN 10.00
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit Flip') THEN 29.99
    ELSE non_port_price
  END,
  upgrade_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G 2024') THEN 29.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G+ 2024') THEN 99.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G SC') THEN 19.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit 5G') THEN 19.99
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit Flip') THEN 29.99
    ELSE upgrade_price
  END,
  monthly_price = CASE
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G 2024') THEN 4.44
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G+ 2024') THEN 6.67
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Celero 5G SC') THEN 3.06
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit 5G') THEN 2.64
    WHEN phone_id IN (SELECT id FROM phones WHERE name = 'Summit Flip') THEN 1.67
    ELSE monthly_price
  END,
  boost_protect = 8.00
WHERE phone_id IN (
  SELECT id FROM phones 
  WHERE brand IN ('Celero', 'Summit', 'TCL')
);

-- Insert port-in plans for budget phones ($25 plan)
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT id, 25, 'port_in'
FROM phones
WHERE brand IN ('Motorola', 'Samsung', 'Celero', 'Summit')
AND name NOT LIKE '%Pro%'
AND name NOT LIKE '%Ultra%'
AND name NOT LIKE '%Plus%'
AND name NOT LIKE '%iPhone%';

-- Insert $50 plan for all phones
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT id, 50, 'port_in'
FROM phones;

-- Insert $60 plan for all phones
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT id, 60, 'port_in'
FROM phones;

-- Insert pay later plans for all phones
INSERT INTO phone_plans (phone_id, plan_price, plan_type)
SELECT p.id, unnest(ARRAY[25, 50, 60]) as plan_price, 'pay_later' as plan_type
FROM phones p;