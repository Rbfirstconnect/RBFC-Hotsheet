/*
  # Verify phone pricing data
  
  1. Check phone_pricing table
  2. Check phone_plans table
  3. Fix any missing or incorrect data
*/

-- First, verify iPhone pricing
SELECT 
  p.name,
  pp.port_in_price,
  pp.non_port_price,
  pp.upgrade_price,
  pp.monthly_price,
  pp.boost_protect,
  string_agg(DISTINCT pl.plan_price::text || ' (' || pl.plan_type || ')', ', ') as plans
FROM phones p
LEFT JOIN phone_pricing pp ON p.id = pp.phone_id
LEFT JOIN phone_plans pl ON p.id = pl.phone_id
WHERE p.brand = 'Apple'
GROUP BY p.name, pp.port_in_price, pp.non_port_price, pp.upgrade_price, pp.monthly_price, pp.boost_protect;

-- Then verify Samsung pricing
SELECT 
  p.name,
  pp.port_in_price,
  pp.non_port_price,
  pp.upgrade_price,
  pp.monthly_price,
  pp.boost_protect,
  string_agg(DISTINCT pl.plan_price::text || ' (' || pl.plan_type || ')', ', ') as plans
FROM phones p
LEFT JOIN phone_pricing pp ON p.id = pp.phone_id
LEFT JOIN phone_plans pl ON p.id = pl.phone_id
WHERE p.brand = 'Samsung'
GROUP BY p.name, pp.port_in_price, pp.non_port_price, pp.upgrade_price, pp.monthly_price, pp.boost_protect;

-- Finally verify other brands
SELECT 
  p.brand,
  p.name,
  pp.port_in_price,
  pp.non_port_price,
  pp.upgrade_price,
  pp.monthly_price,
  pp.boost_protect,
  string_agg(DISTINCT pl.plan_price::text || ' (' || pl.plan_type || ')', ', ') as plans
FROM phones p
LEFT JOIN phone_pricing pp ON p.id = pp.phone_id
LEFT JOIN phone_plans pl ON p.id = pl.phone_id
WHERE p.brand NOT IN ('Apple', 'Samsung')
GROUP BY p.brand, p.name, pp.port_in_price, pp.non_port_price, pp.upgrade_price, pp.monthly_price, pp.boost_protect;