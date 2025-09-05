-- Fix the role constraint to include 'admin'
ALTER TABLE public.profiles 
DROP CONSTRAINT profiles_role_check;

-- Add updated constraint with 'admin' role
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['employee'::text, 'manager'::text, 'finance_admin'::text, 'observer'::text, 'admin'::text]));