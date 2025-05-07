/*
  # Remove RLS and implement basic user management
  
  1. Changes
    - Disable RLS on all tables
    - Drop existing policies
    - Create admin user if not exists
*/

-- Disable RLS on all tables
ALTER TABLE phones DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_pricing DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_specifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_bundles DISABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public can view phones" ON phones;
  DROP POLICY IF EXISTS "Admins can manage phones" ON phones;
  DROP POLICY IF EXISTS "Public can view pricing" ON phone_pricing;
  DROP POLICY IF EXISTS "Admins can manage pricing" ON phone_pricing;
  DROP POLICY IF EXISTS "Public can view plans" ON phone_plans;
  DROP POLICY IF EXISTS "Admins can manage plans" ON phone_plans;
  DROP POLICY IF EXISTS "Public can view promotions" ON phone_promotions;
  DROP POLICY IF EXISTS "Admins can manage promotions" ON phone_promotions;
  DROP POLICY IF EXISTS "Public can view specifications" ON phone_specifications;
  DROP POLICY IF EXISTS "Admins can manage specifications" ON phone_specifications;
  DROP POLICY IF EXISTS "Public can view bundles" ON phone_bundles;
  DROP POLICY IF EXISTS "Admins can manage bundles" ON phone_bundles;
  DROP POLICY IF EXISTS "Public can view bundle items" ON bundle_items;
  DROP POLICY IF EXISTS "Admins can manage bundle items" ON bundle_items;
  DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
  DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
  DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;
  DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
END $$;