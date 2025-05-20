/*
  # Update registrations table to support multiple ministries

  1. Changes
    - Modify `ministry` column to be an array of text values
    - Add check constraint to ensure at least one ministry is selected
    - Update RLS policies to maintain security

  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE registrations 
ALTER COLUMN ministry TYPE text[] USING ARRAY[ministry];

ALTER TABLE registrations
ADD CONSTRAINT ministries_not_empty CHECK (array_length(ministry, 1) > 0);