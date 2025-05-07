/*
  # Update plans format
  
  1. Changes
    - Reorder plan object fields to have price first
    - Maintain same plan assignments for different phone types
    - Sort plans by type and price
*/

-- First update all existing records to have basic plans with correct field order
UPDATE phone_details
SET available_plans = jsonb_build_array(
  jsonb_build_object('price', 50, 'type', 'port_in'),
  jsonb_build_object('price', 60, 'type', 'port_in'),
  jsonb_build_object('price', 50, 'type', 'pay_later'),
  jsonb_build_object('price', 60, 'type', 'pay_later')
);

-- Add $25 plans for budget phones with correct field order
UPDATE phone_details
SET available_plans = available_plans || 
  jsonb_build_array(
    jsonb_build_object('price', 25, 'type', 'port_in'),
    jsonb_build_object('price', 25, 'type', 'pay_later')
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

-- Verify the update
SELECT name, brand, available_plans
FROM phone_details
ORDER BY brand, name;