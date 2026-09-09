import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './ToastContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Global Progress State
  const [progress, setProgress] = useState(() => loadState('bhashasetu_progress', {
    completedLessons: [],
    inProgressLessons: {},
    unlockedBadges: ['Curious Learner', 'Language Explorer']
  }));

  useEffect(() => {
    saveState('bhashasetu_progress', progress);
  }, [progress]);

  const fetchProfile = async (sessionUser) => {
    if (!supabase) return null;
    
    // First, try to fetch the profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionUser.id)
      .maybeSingle();
      
    if (error) {
      console.error('PROFILE LOAD ERROR:', error);
      console.error('Authenticated user id:', sessionUser.id);
      addToast("Failed to load your profile. " + (error.message || ""), "error");
      return null;
    }
    
    if (data) {
      return data;
    }
    
    // If no profile exists (data is null and error is null), we must create it now that we are authenticated
    const meta = sessionUser.user_metadata || {};
    let role = meta.role?.toLowerCase();
    
    // Do NOT guess the role. If it's missing or invalid, fail cleanly.
    if (role !== 'student' && role !== 'teacher') {
      console.error('PROFILE CREATE ERROR: Missing or invalid role in user_metadata', meta);
      addToast("Your account has no assigned role. Please contact support or sign up again.", "error");
      return null;
    }

    const newProfile = {
      id: sessionUser.id,
      name: meta.name || 'User',
      email: sessionUser.email,
      role: role,
      student_code: meta.student_code || null,
      teacher_id: meta.teacher_id || null
    };
    
    const { data: insertedData, error: insertError } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .maybeSingle();
      
    if (insertError) {
      console.error("PROFILE CREATE ERROR:", insertError);
      addToast("Your account was created, but your profile could not be saved. " + (insertError.message || ""), "error");
      return null;
    } 

    if (insertedData) {
      return insertedData;
    }
    
    return null;
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    let isFetchingInitial = false;

    const initializeAuth = async () => {
      isFetchingInitial = true;
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      
      setSession(session);
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      }
      setLoading(false);
      isFetchingInitial = false;
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      // Prevent double fetching if INITIAL_SESSION fires concurrently with getSession
      if (event === 'INITIAL_SESSION' && isFetchingInitial) return;
      
      if (event === 'SIGNED_IN') {
         setLoading(true);
      }

      setSession(session);
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const markLessonComplete = (lessonId) => {
    setProgress((prev) => ({
      ...prev,
      completedLessons: [...new Set([...prev.completedLessons, lessonId])]
    }));
  };

  const updateLessonProgress = (lessonId, percent) => {
    setProgress((prev) => ({
      ...prev,
      inProgressLessons: {
        ...prev.inProgressLessons,
        [lessonId]: percent
      }
    }));
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      session,
      loading,
      progress,
      markLessonComplete,
      updateLessonProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
