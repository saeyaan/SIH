import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/Toast';
import AppLayout from './layouts/AppLayout';
import TeacherLayout from './layouts/TeacherLayout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import AskAI from './pages/AskAI';
import Speak from './pages/Speak';
import MyLessons from './pages/MyLessons';
import Profile from './pages/Profile';
import Translate from './pages/Translate';
import LiveClass from './pages/LiveClass';
import Badges from './pages/Badges';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import { useApp } from './context/AppContext';

// LT-005: Route guard for authenticated student users
const PrivateRoute = ({ children }) => {
  const { user } = useApp();
  if (!user || !user.role) return <Navigate to="/login" replace />;
  return children;
};

// LT-005: Route guard for teacher-role users
const TeacherRoute = ({ children }) => {
  const { user } = useApp();
  if (!user || user.role !== 'teacher') return <Navigate to="/login" replace />;
  return children;
};

// LT-045: Simple 404 page
const NotFound = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: '1rem' }}>
    <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)', margin: 0 }}>404</h1>
    <h2 style={{ margin: 0 }}>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="learn" element={<PrivateRoute><Learn /></PrivateRoute>} />
              <Route path="ask-ai" element={<PrivateRoute><AskAI /></PrivateRoute>} />
              <Route path="speak" element={<PrivateRoute><Speak /></PrivateRoute>} />
              <Route path="my-lessons" element={<PrivateRoute><MyLessons /></PrivateRoute>} />
              <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="translate" element={<PrivateRoute><Translate /></PrivateRoute>} />
              <Route path="live-class" element={<PrivateRoute><LiveClass /></PrivateRoute>} />
              <Route path="badges" element={<PrivateRoute><Badges /></PrivateRoute>} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/teacher" element={<TeacherRoute><TeacherLayout /></TeacherRoute>}>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
