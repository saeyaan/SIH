import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Mic, FileText, User, Languages, Video, Award } from 'lucide-react';
import Card from '../components/Card';

const StudentSidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Learn', icon: BookOpen, path: '/learn' },
    { name: 'Ask AI', icon: MessageCircle, path: '/ask-ai' },
    { name: 'Speak', icon: Mic, path: '/speak' },
    { name: 'My Lessons', icon: FileText, path: '/my-lessons' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Translate', icon: Languages, path: '/translate' },
    { name: 'Live Class', icon: Video, path: '/live-class' },
    { name: 'Badges', icon: Award, path: '/badges' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--spacing-xl)', padding: '0 10px' }}>
        <div style={{ background: 'var(--color-accent)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={20} color="var(--color-primary-dark)" strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 'var(--fs-h3)', color: 'var(--color-primary-dark)' }}>BhashaSetu</h2>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>EVERY CHILD LEARNS</span>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-md)', padding: '0 10px' }}>
        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '1px' }}>FOR STUDENTS</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `teacher-nav-item ${isActive || (item.path === '/' && window.location.pathname === '/') ? 'active' : ''}`}
            style={({ isActive }) => {
              const isHomeActive = item.path === '/' && window.location.pathname === '/';
              const active = isActive || isHomeActive;
              return {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: active ? 'white' : 'var(--color-text-main)',
              background: active ? 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))' : 'transparent',
              boxShadow: active ? 'var(--shadow-neu-outer-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}}
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <select 
          className="input-field"
          style={{ cursor: 'pointer', fontWeight: 600, padding: '10px 16px' }}
        >
          <option value="English">🌐 English</option>
          <option value="Hindi">🌐 Hindi</option>
          <option value="Bengali">🌐 Bengali</option>
        </select>
      </div>
      
    </div>
  );
};

export default StudentSidebar;
