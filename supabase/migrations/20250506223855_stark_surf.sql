/*
  # Fix user roles schema
  
  1. Changes
    - Drop existing user_roles table
    - Create new user_roles table with correct constraints
    - Add role column directly to user_roles table
*/

-- Drop existing user_roles table if exists
DROP TABLE IF EXISTS user_roles;

-- Create new user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint on user_id
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);