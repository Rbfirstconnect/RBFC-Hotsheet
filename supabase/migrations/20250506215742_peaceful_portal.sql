/*
  # User Roles Schema Setup

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `role` (text, check constraint for 'admin' or 'user')
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_roles` table
    - Add policy for admins to manage all roles
    - Add policy for users to read their own role

  3. Initial Data
    - Create admin user if not exists
    - Add admin role
*/

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint on user_id
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
  DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;
END $$;

-- Create policies
CREATE POLICY "Admins can manage all roles"
  ON user_roles
  FOR ALL
  TO public
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Users can read their own role"
  ON user_roles
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Create admin user if not exists
DO $$ 
DECLARE 
  admin_user_id uuid;
BEGIN
  -- Check if admin user exists
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@example.com';

  -- If admin user doesn't exist, create it
  IF admin_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      'c9b06aec-3e9e-4c4a-8c2f-a8d00f8e6be7',
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now()
    )
    RETURNING id INTO admin_user_id;
  END IF;

  -- Add admin role if not exists
  INSERT INTO user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT ON CONSTRAINT user_roles_user_id_key DO NOTHING;
END $$;