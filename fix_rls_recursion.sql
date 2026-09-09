-- Break the infinite recursion by creating SECURITY DEFINER helper functions

-- 1. Helper function for Classes Policy
CREATE OR REPLACE FUNCTION public.is_student_in_class(check_class_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- Runs as the creator, bypassing RLS on class_members
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.class_members 
    WHERE class_id = check_class_id AND student_id = auth.uid()
  );
$$;

-- 2. Helper function for Class Members Policy
CREATE OR REPLACE FUNCTION public.is_teacher_of_class(check_class_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- Runs as the creator, bypassing RLS on classes
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classes 
    WHERE id = check_class_id AND teacher_id = auth.uid()
  );
$$;

-- 3. Drop existing cyclic policies
DROP POLICY IF EXISTS "Classes Select Policy" ON public.classes;
DROP POLICY IF EXISTS "Class Members Select Policy" ON public.class_members;

-- 4. Recreate NON-RECURSIVE Select Policies
CREATE POLICY "Classes Select Policy" 
ON public.classes FOR SELECT TO authenticated 
USING (
  teacher_id = auth.uid() 
  OR public.is_student_in_class(id)
);

CREATE POLICY "Class Members Select Policy"
ON public.class_members FOR SELECT TO authenticated 
USING (
  student_id = auth.uid() 
  OR public.is_teacher_of_class(class_id)
);

-- Note: INSERT/UPDATE/DELETE policies were already non-recursive 
-- but let's make sure they are strictly enforced for safety:

-- Classes:
DROP POLICY IF EXISTS "Classes Insert Policy" ON public.classes;
DROP POLICY IF EXISTS "Classes Update Policy" ON public.classes;
DROP POLICY IF EXISTS "Classes Delete Policy" ON public.classes;

CREATE POLICY "Classes Insert Policy" 
ON public.classes FOR INSERT TO authenticated 
WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Classes Update Policy" 
ON public.classes FOR UPDATE TO authenticated 
USING (teacher_id = auth.uid());

CREATE POLICY "Classes Delete Policy" 
ON public.classes FOR DELETE TO authenticated 
USING (teacher_id = auth.uid());

-- Class Members:
DROP POLICY IF EXISTS "Class Members Insert Policy" ON public.class_members;
DROP POLICY IF EXISTS "Class Members Delete Policy" ON public.class_members;

CREATE POLICY "Class Members Insert Policy"
ON public.class_members FOR INSERT TO authenticated 
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Class Members Delete Policy"
ON public.class_members FOR DELETE TO authenticated 
USING (student_id = auth.uid());

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
