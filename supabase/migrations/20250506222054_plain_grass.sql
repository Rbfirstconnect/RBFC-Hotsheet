/*
  # Fix RLS and Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Re-enable RLS on all tables
    - Create new policies with proper checks
    - Fix user roles table policies

  2. Security
    - Enable RLS on all tables
    - Add proper policies for public and authenticated access
    - Fix admin role management
*/

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies from user_roles
  DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
  DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
  DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;
  
  -- Drop policies from phones
  DROP POLICY IF EXISTS "Public can view phones" ON phones;
  DROP POLICY IF EXISTS "Admins can manage phones" ON phones;
  
  -- Drop policies from phone_pricing
  DROP POLICY IF EXISTS "Public can view pricing" ON phone_pricing;
  DROP POLICY IF EXISTS "Admins can manage pricing" ON phone_pricing;
  
  -- Drop policies from phone_plans
  DROP POLICY IF EXISTS "Public can view plans" ON phone_plans;
  DROP POLICY IF EXISTS "Admins can manage plans" ON phone_plans;
  
  -- Drop policies from phone_promotions
  DROP POLICY IF EXISTS "Public can view promotions" ON phone_promotions;
  DROP POLICY IF EXISTS "Admins can manage promotions" ON phone_promotions;
  
  -- Drop policies from phone_specifications
  DROP POLICY IF EXISTS "Public can view specifications" ON phone_specifications;
  DROP POLICY IF EXISTS "Admins can manage specifications" ON phone_specifications;
  
  -- Drop policies from phone_bundles
  DROP POLICY IF EXISTS "Public can view bundles" ON phone_bundles;
  DROP POLICY IF EXISTS "Admins can manage bundles" ON phone_bundles;
  
  -- Drop policies from bundle_items
  DROP POLICY IF EXISTS "Public can view bundle items" ON bundle_items;
  DROP POLICY IF EXISTS "Admins can manage bundle items" ON bundle_items;
END $$;

-- Enable RLS on all tables
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create new policies
-- Phones table policies
CREATE POLICY "Public can view phones"
  ON phones
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage phones"
  ON phones
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  ));

-- Phone pricing policies
CREATE POLICY "Public can view pricing"
  ON phone_pricing
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage pricing"
  ON phone_pricing
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  ));

-- Phone plans policies
CREATE POLICY "Public can view plans"
  ON phone_plans
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage plans"
  ON phone_plans
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  ));

-- Phone promotions policies
CREATE POLICY "Public can view promotions"
  ON phone_promotions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage promotions"
  ON phone_promotions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  ));

-- Phone specifications policies
CREATE POLICY "Public can view specifications"
  ON phone_specifications
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage specifications"
  ON phone_specifications
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  ));

-- Phone bundles policies
CREATE POLICY "Public can view bundles"
  ON phone_bundles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage bundles"
  ON phone_bundles
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  ));

-- Bundle items policies
CREATE POLICY "Public can view bundle items"
  ON bundle_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage bundle items"
  ON bundle_items
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  ));

-- User roles policies
CREATE POLICY "Users can view their own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  ));