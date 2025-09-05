-- First update the data, then modify constraints
UPDATE public.expenses 
SET status = 'submitted' 
WHERE status = 'pending';

-- Drop the existing constraint
ALTER TABLE public.expenses 
DROP CONSTRAINT expenses_status_check;

-- Add the new constraint with proper status values
ALTER TABLE public.expenses 
ADD CONSTRAINT expenses_status_check 
CHECK (status = ANY (ARRAY['draft'::text, 'submitted'::text, 'approved'::text, 'rejected'::text, 'reimbursed'::text]));

-- Add new columns for approval workflow
ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS submitted_at timestamp with time zone;

-- Set submitted_at for already submitted expenses
UPDATE public.expenses 
SET submitted_at = created_at 
WHERE status = 'submitted' AND submitted_at IS NULL;

-- Create function to handle expense submission
CREATE OR REPLACE FUNCTION public.submit_expense(expense_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.expenses 
  SET 
    status = 'submitted',
    submitted_at = now(),
    updated_at = now()
  WHERE id = expense_id 
    AND user_id = auth.uid() 
    AND status = 'draft';
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Expense not found or cannot be submitted';
  END IF;
END;
$$;

-- Create function to approve expense (admin only)
CREATE OR REPLACE FUNCTION public.approve_expense(expense_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Only admins can approve expenses';
  END IF;
  
  UPDATE public.expenses 
  SET 
    status = 'approved',
    approved_by = auth.uid(),
    approved_at = now(),
    updated_at = now()
  WHERE id = expense_id 
    AND status = 'submitted';
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Expense not found or not in submitted status';
  END IF;
END;
$$;

-- Create function to reject expense (admin only)
CREATE OR REPLACE FUNCTION public.reject_expense(expense_id uuid, reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Only admins can reject expenses';
  END IF;
  
  UPDATE public.expenses 
  SET 
    status = 'rejected',
    approved_by = auth.uid(),
    approved_at = now(),
    rejection_reason = reason,
    updated_at = now()
  WHERE id = expense_id 
    AND status = 'submitted';
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Expense not found or not in submitted status';
  END IF;
END;
$$;