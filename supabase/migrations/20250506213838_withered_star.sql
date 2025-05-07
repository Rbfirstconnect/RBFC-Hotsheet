-- Disable RLS on all tables
ALTER TABLE phones DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_pricing DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_specifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_bundles DISABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read phones" ON phones;
DROP POLICY IF EXISTS "Admin can manage phones" ON phones;
DROP POLICY IF EXISTS "Anyone can read phone pricing" ON phone_pricing;
DROP POLICY IF EXISTS "Admin can manage phone pricing" ON phone_pricing;
DROP POLICY IF EXISTS "Anyone can read phone plans" ON phone_plans;
DROP POLICY IF EXISTS "Admin can manage phone plans" ON phone_plans;
DROP POLICY IF EXISTS "Anyone can read phone promotions" ON phone_promotions;
DROP POLICY IF EXISTS "Admin can manage phone promotions" ON phone_promotions;
DROP POLICY IF EXISTS "Anyone can read phone specifications" ON phone_specifications;
DROP POLICY IF EXISTS "Admin can manage phone specifications" ON phone_specifications;
DROP POLICY IF EXISTS "Anyone can read phone bundles" ON phone_bundles;
DROP POLICY IF EXISTS "Admin can manage phone bundles" ON phone_bundles;
DROP POLICY IF EXISTS "Anyone can read bundle items" ON bundle_items;
DROP POLICY IF EXISTS "Admin can manage bundle items" ON bundle_items;