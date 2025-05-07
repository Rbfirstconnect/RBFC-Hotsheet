/*
  # Create admin user

  1. Creates a new admin user with the following details:
    - Email: parth@gmail.com
    - Password: Boost@123
    - First Name: Parth
    - Last Name: Patel
    - Username: Parth

  2. Assigns admin role if not already assigned
*/

-- Create admin user
DO $$ 
DECLARE 
  new_user_id uuid;
BEGIN
  -- Create the user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'parth@gmail.com',
    crypt('Boost@123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object(
      'first_name', 'Parth',
      'last_name', 'Patel',
      'username', 'Parth'
    )
  )
  RETURNING id INTO new_user_id;

  -- Add admin role if not exists
  INSERT INTO user_roles (user_id, role)
  VALUES (new_user_id, 'admin')
  ON CONFLICT (user_id) DO NOTHING;

  -- Ensure RLS is disabled
  ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
END $$;