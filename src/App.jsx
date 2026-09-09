import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import ToastContainer from './components/Toast';
import AppLayout from './layouts/AppLayout';
import TeacherLayout from './layouts/TeacherLayout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import AskAI from './pages/AskAI';
import StudentChat from './pages/StudentChat';
import MyLessons from './pages/MyLessons';
import Profile from './pages/Profile';
import Translate from './pages/Translate';
import Badges from './pages/Badges';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherPageWrapper from './pages/TeacherPageWrapper';
import MyClasses from './components/teacher/MyClasses';
import ClassDetails from './components/teacher/ClassDetails';
import TeacherCreateLesson from './components/teacher/TeacherCreateLesson';
import TeacherChat from './components/teacher/TeacherChat';
import TeacherAnalytics from './components/teacher/TeacherAnalytics';
import TeacherReminders from './components/teacher/TeacherReminders';
import { supabase } from './lib/supabaseClient';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useApp();
  
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading session...</div>;
  
  if (!user || !user.role) return <Navigate to="/login" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  
  return children;
};

const TeacherRoute = ({ children }) => {
  const { user, loading } = useApp();
  
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading session...</div>;
  
  if (!user || user.role !== 'teacher') return <Navigate to="/login" replace />;
  
  return children;
};

const AuthGuard = ({ children }) => {
  const { user, loading } = useApp();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading session...</div>;
  if (user) {
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

const NotFound = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: '1rem' }}>
    <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)', margin: 0 }}>404</h1>
    <h2 style={{ margin: 0 }}>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

const ConfigWarning = () => (
  <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
    Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AppProvider>
          <Router>
            {!supabase && <ConfigWarning />}
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="learn" element={<PrivateRoute><Learn /></PrivateRoute>} />
                <Route path="ask-ai" element={<PrivateRoute><AskAI /></PrivateRoute>} />
                <Route path="chat" element={<PrivateRoute><StudentChat /></PrivateRoute>} />
                <Route path="my-lessons" element={<PrivateRoute><MyLessons /></PrivateRoute>} />
                <Route path="profile" element={<PrivateRoute><Profile forceRole="student" /></PrivateRoute>} />
                <Route path="translate" element={<PrivateRoute><Translate /></PrivateRoute>} />
                <Route path="badges" element={<PrivateRoute><Badges /></PrivateRoute>} />
                <Route path="login" element={<AuthGuard><Login /></AuthGuard>} />
                <Route path="signup" element={<AuthGuard><Signup /></AuthGuard>} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/teacher" element={<TeacherRoute><TeacherLayout /></TeacherRoute>}>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="classes" element={<TeacherPageWrapper title="My Classes"><MyClasses /></TeacherPageWrapper>} />
                <Route path="classes/:id" element={<TeacherPageWrapper title="Class Details"><ClassDetails /></TeacherPageWrapper>} />
                <Route path="create" element={<TeacherPageWrapper title="Create Lesson"><TeacherCreateLesson /></TeacherPageWrapper>} />
                <Route path="lessons" element={<TeacherPageWrapper><MyLessons /></TeacherPageWrapper>} />
                <Route path="translate" element={<TeacherPageWrapper><Translate /></TeacherPageWrapper>} />
                <Route path="chat" element={<TeacherPageWrapper title="Student Interaction"><TeacherChat /></TeacherPageWrapper>} />
                <Route path="analytics" element={<TeacherPageWrapper title="Analytics"><TeacherAnalytics /></TeacherPageWrapper>} />
                <Route path="reminders" element={<TeacherPageWrapper title="Reminders"><TeacherReminders /></TeacherPageWrapper>} />
                <Route path="profile" element={<TeacherPageWrapper title="Profile"><Profile forceRole="teacher" /></TeacherPageWrapper>} />
                <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </Router>
        </AppProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
