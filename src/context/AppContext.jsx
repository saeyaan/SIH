import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Global User State
  const [user, setUser] = useState(() => loadState('bhashasetu_user', {
    name: 'Aarav',
    class: 'Class 4',
    primaryLanguage: 'Hindi',
    secondaryLanguage: 'English',
    role: 'student'
  }));

  // Global Progress State
  const [progress, setProgress] = useState(() => loadState('bhashasetu_progress', {
    completedLessons: [],
    inProgressLessons: {},
    unlockedBadges: ['Curious Learner', 'Language Explorer']
  }));

  // Theme State
  const [theme, setTheme] = useState(() => loadState('bhashasetu_theme', 'light'));

  // Save states when they change
  useEffect(() => {
    saveState('bhashasetu_user', user);
  }, [user]);

  useEffect(() => {
    saveState('bhashasetu_progress', progress);
  }, [progress]);

  useEffect(() => {
    saveState('bhashasetu_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Helpers
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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      progress,
      markLessonComplete,
      updateLessonProgress,
      theme,
      toggleTheme
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
