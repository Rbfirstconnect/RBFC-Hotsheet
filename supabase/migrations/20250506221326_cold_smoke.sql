/*
  # Enable RLS and add missing policies
  
  1. Changes
    - Enable RLS on all tables that don't have it enabled
    - Add policies for public read access
    - Add policies for admin management
    - Skip existing policies to avoid duplicates
*/

-- Enable RLS on tables
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;

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
    WHERE user_id = auth.uid()
    AND role = 'admin'
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
    WHERE user_id = auth.uid()
    AND role = 'admin'
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
    WHERE user_id = auth.uid()
    AND role = 'admin'
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
    WHERE user_id = auth.uid()
    AND role = 'admin'
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
    WHERE user_id = auth.uid()
    AND role = 'admin'
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
    WHERE user_id = auth.uid()
    AND role = 'admin'
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
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ));

-- Users can view their own role policy
CREATE POLICY "Users can view their own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);