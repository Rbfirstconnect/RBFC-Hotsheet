/*
  # Set up admin user and policies
  
  1. Changes
    - Add admin user if not exists
    - Add admin role if not exists
    - Enable RLS on user_roles table
    - Add RLS policies if they don't exist
  
  2. Security
    - Enable RLS on user_roles table
    - Add policy for admins to manage all roles
    - Add policy for users to read their own role
*/

DO $$ 
BEGIN
  -- Create admin user if not exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
  ) THEN
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
    );
  END IF;

  -- Add admin role if not exists
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = 'c9b06aec-3e9e-4c4a-8c2f-a8d00f8e6be7'
  ) THEN
    INSERT INTO user_roles (user_id, role)
    VALUES ('c9b06aec-3e9e-4c4a-8c2f-a8d00f8e6be7', 'admin');
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Add RLS policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' AND policyname = 'Admins can manage all roles'
  ) THEN
    CREATE POLICY "Admins can manage all roles"
      ON user_roles
      FOR ALL
      TO public
      USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' AND policyname = 'Users can read their own role'
  ) THEN
    CREATE POLICY "Users can read their own role"
      ON user_roles
      FOR SELECT
      TO public
      USING (auth.uid() = user_id);
  END IF;
END $$;