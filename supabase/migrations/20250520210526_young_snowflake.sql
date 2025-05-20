/*
  # Create initial tables for the ministry registration system

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `full_name` (text)
      - `phone` (text)
      - `ministry` (text)
    - `profiles`
      - `id` (uuid, primary key, references auth.users.id)
      - `created_at` (timestamp)
      - `email` (text)
      - `role` (text, default 'admin')

  2. Security
    - Enable RLS on `registrations` and `profiles` tables
    - Add policies for authenticated users to read/write data
*/

-- Create the registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  phone text NOT NULL,
  ministry text NOT NULL
);

-- Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  role text DEFAULT 'admin'
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for registrations table
CREATE POLICY "Anyone can insert registrations" 
  ON registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all registrations" 
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for profiles table
CREATE POLICY "Profiles can be read by authenticated users" 
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);