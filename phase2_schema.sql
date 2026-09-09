-- 1. Create public.classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create public.class_members table
CREATE TABLE IF NOT EXISTS public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(class_id, student_id)
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

-- 3. RLS for classes
-- Teachers can create classes where they are the owner
CREATE POLICY "Teachers can create classes" 
ON public.classes 
FOR INSERT 
WITH CHECK (teacher_id = auth.uid());

-- Teachers can update their own classes
CREATE POLICY "Teachers can update own classes" 
ON public.classes 
FOR UPDATE 
USING (teacher_id = auth.uid());

-- Teachers can delete their own classes
CREATE POLICY "Teachers can delete own classes" 
ON public.classes 
FOR DELETE 
USING (teacher_id = auth.uid());

-- Authenticated users can read classes they belong to, or teachers can read their own
CREATE POLICY "Users can view classes they own or belong to" 
ON public.classes 
FOR SELECT 
USING (
  teacher_id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM public.class_members 
    WHERE class_members.class_id = classes.id 
    AND class_members.student_id = auth.uid()
  )
);

-- 4. RLS for class_members
-- Students can insert themselves into class_members
CREATE POLICY "Students can join classes"
ON public.class_members
FOR INSERT
WITH CHECK (student_id = auth.uid());

-- Students can read their own memberships, Teachers can read memberships of their classes
CREATE POLICY "Users can view relevant memberships"
ON public.class_members
FOR SELECT
USING (
  student_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.classes
    WHERE classes.id = class_members.class_id
    AND classes.teacher_id = auth.uid()
  )
);

-- Students can delete their own membership (leave class)
CREATE POLICY "Students can leave classes"
ON public.class_members
FOR DELETE
USING (student_id = auth.uid());


-- 5. Helper Function to Join Class Securely
-- Since students cannot select a class they haven't joined yet, 
-- they cannot simply lookup the class_id by class_code using a standard SELECT.
-- This function allows them to securely resolve a code to an ID and join.
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
  -- 1. Find the class
  SELECT id, teacher_id, name INTO v_class_id, v_teacher_id, v_class_name 
  FROM public.classes 
  WHERE class_code = p_class_code;
  
  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'Invalid class code';
  END IF;
  
  -- 2. Prevent teachers from joining as students to their own class if desired (optional)
  IF v_teacher_id = auth.uid() THEN
    RAISE EXCEPTION 'You are the teacher of this class';
  END IF;

  -- 3. Check for existing membership to prevent duplicate errors bubbling up poorly
  IF EXISTS (SELECT 1 FROM public.class_members WHERE class_id = v_class_id AND student_id = auth.uid()) THEN
    RAISE EXCEPTION 'Already joined this class';
  END IF;

  -- 4. Insert into class_members
  INSERT INTO public.class_members (class_id, student_id)
  VALUES (v_class_id, auth.uid());

  RETURN json_build_object('class_id', v_class_id, 'class_name', v_class_name);
END;
$$;
