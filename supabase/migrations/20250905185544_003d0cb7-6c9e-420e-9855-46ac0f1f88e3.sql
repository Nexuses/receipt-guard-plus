-- Create admin role functionality and set up admin user

-- First, let's create a function to promote a user to admin
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin', updated_at = now()
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$;

-- Create a function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Add RLS policies for admin access to profiles table
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_current_user_admin());

-- Add admin access to expenses
CREATE POLICY "Admins can view all expenses" 
ON public.expenses 
FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "Admins can update all expenses" 
ON public.expenses 
FOR UPDATE 
USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete all expenses" 
ON public.expenses 
FOR DELETE 
USING (public.is_current_user_admin());