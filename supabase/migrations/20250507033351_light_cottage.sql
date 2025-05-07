/*
  # Update phone plans structure
  
  1. Changes
    - Update all phone_details records to have consistent plan structure
    - Add $25 plans for budget phones
    - Ensure plans are stored in correct JSONB format
*/

-- First update all existing records to have basic plans
UPDATE phone_details
SET available_plans = jsonb_build_array(
  jsonb_build_object('type', 'port_in', 'price', 50),
  jsonb_build_object('type', 'port_in', 'price', 60),
  jsonb_build_object('type', 'pay_later', 'price', 50),
  jsonb_build_object('type', 'pay_later', 'price', 60)
);

-- Add $25 plans for budget phones
UPDATE phone_details
SET available_plans = available_plans || 
  jsonb_build_array(
    jsonb_build_object('type', 'port_in', 'price', 25),
    jsonb_build_object('type', 'pay_later', 'price', 25)
  )
WHERE brand IN ('Motorola', 'Samsung', 'Celero', 'Summit')
  AND name NOT LIKE '%Pro%'
  AND name NOT LIKE '%Ultra%'
  AND name NOT LIKE '%Plus%'
  AND name NOT LIKE '%iPhone%';

-- Sort plans by type and price
UPDATE phone_details
SET available_plans = (
  SELECT jsonb_agg(plan ORDER BY plan->>'type', (plan->>'price')::numeric)
  FROM jsonb_array_elements(available_plans) plan
);