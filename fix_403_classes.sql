-- 1. Ensure authenticated role has full access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_members TO authenticated;

-- 2. Ensure RLS is enabled
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

-- 3. Drop all potentially conflicting existing policies for classes
DROP POLICY IF EXISTS "Teachers can create classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can update own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can delete own classes" ON public.classes;
DROP POLICY IF EXISTS "Users can view classes they own or belong to" ON public.classes;
DROP POLICY IF EXISTS "Users can read classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can create their own classes" ON public.classes;

-- 4. Recreate precise policies for classes
-- INSERT: Teacher must be creating a class for themselves
CREATE POLICY "Classes Insert Policy" 
ON public.classes FOR INSERT 
TO authenticated 
WITH CHECK (teacher_id = auth.uid());

-- UPDATE: Teacher can only update their own classes
CREATE POLICY "Classes Update Policy" 
ON public.classes FOR UPDATE 
TO authenticated 
USING (teacher_id = auth.uid());

-- DELETE: Teacher can only delete their own classes
CREATE POLICY "Classes Delete Policy" 
ON public.classes FOR DELETE 
TO authenticated 
USING (teacher_id = auth.uid());

-- SELECT: Teachers can see their own classes. Students can see classes they joined.
CREATE POLICY "Classes Select Policy" 
ON public.classes FOR SELECT 
TO authenticated 
USING (
  teacher_id = auth.uid() 
  OR id IN (
      SELECT class_id FROM public.class_members WHERE student_id = auth.uid()
  )
);

-- 5. Drop and recreate policies for class_members
DROP POLICY IF EXISTS "Students can join classes" ON public.class_members;
DROP POLICY IF EXISTS "Users can view relevant memberships" ON public.class_members;
DROP POLICY IF EXISTS "Students can leave classes" ON public.class_members;

CREATE POLICY "Class Members Insert Policy"
ON public.class_members FOR INSERT 
TO authenticated 
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Class Members Select Policy"
ON public.class_members FOR SELECT 
TO authenticated 
USING (
  student_id = auth.uid() 
  OR class_id IN (
      SELECT id FROM public.classes WHERE teacher_id = auth.uid()
  )
);

CREATE POLICY "Class Members Delete Policy"
ON public.class_members FOR DELETE 
TO authenticated 
USING (student_id = auth.uid());

-- 6. Reload schema just in case
NOTIFY pgrst, 'reload schema';
