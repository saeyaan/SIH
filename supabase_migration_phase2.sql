-- 1. Create public.classes
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create public.class_members
CREATE TABLE IF NOT EXISTS public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- 3. Enable Row Level Security
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

-- 4. RLS for public.classes
-- Teachers can create/update/delete classes they own
CREATE POLICY "Teachers can create classes" 
ON public.classes FOR INSERT 
WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own classes" 
ON public.classes FOR UPDATE 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own classes" 
ON public.classes FOR DELETE 
USING (teacher_id = auth.uid());

-- Authenticated users can view classes they are members of, and teachers can view their own classes
CREATE POLICY "Users can view classes they own or belong to" 
ON public.classes FOR SELECT 
USING (
  teacher_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.class_members 
    WHERE class_members.class_id = classes.id 
    AND class_members.student_id = auth.uid()
  )
);

-- 5. RLS for public.class_members
-- Students can insert themselves into class_members (handled by the secure RPC)
CREATE POLICY "Students can join classes"
ON public.class_members FOR INSERT 
WITH CHECK (student_id = auth.uid());

-- Students can view their own class memberships, teachers can view/manage members of their own classes
CREATE POLICY "Users can view relevant memberships"
ON public.class_members FOR SELECT 
USING (
  student_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.classes
    WHERE classes.id = class_members.class_id AND classes.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can leave classes"
ON public.class_members FOR DELETE 
USING (student_id = auth.uid());

-- 6. Helper Function for Students to Join by Code securely
CREATE OR REPLACE FUNCTION join_class_by_code(p_class_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_class_id UUID;
  v_teacher_id UUID;
  v_class_name TEXT;
BEGIN
  SELECT id, teacher_id, name INTO v_class_id, v_teacher_id, v_class_name 
  FROM public.classes WHERE class_code = p_class_code;
  
  IF v_class_id IS NULL THEN RAISE EXCEPTION 'Invalid class code'; END IF;
  IF v_teacher_id = auth.uid() THEN RAISE EXCEPTION 'You are the teacher of this class'; END IF;
  IF EXISTS (SELECT 1 FROM public.class_members WHERE class_id = v_class_id AND student_id = auth.uid()) THEN
    RAISE EXCEPTION 'Already joined this class';
  END IF;

  INSERT INTO public.class_members (class_id, student_id) VALUES (v_class_id, auth.uid());
  RETURN json_build_object('class_id', v_class_id, 'class_name', v_class_name);
END;
$$;

-- 7. Add required grants for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_members TO authenticated;

-- 8. Refresh the PostgREST schema cache
NOTIFY pgrst, 'reload schema';
