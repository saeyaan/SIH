-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  student_code TEXT,
  teacher_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow inserting profile during signup (often requires a trigger, but if doing from client-side after signup, they need insert rights for their own id)
CREATE POLICY "Users can insert own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);
