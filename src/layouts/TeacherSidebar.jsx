import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, PlusCircle, FileText, Video, Languages, MessageSquare, BarChart, Bell, BookOpen, Leaf } from 'lucide-react';
import Card from '../components/Card';

const TeacherSidebar = () => {
  const navItems = [
    { name: 'Home', icon: Home, path: '/teacher/dashboard' },
    { name: 'My Classes', icon: Users, path: '/teacher/classes' },
    { name: 'Create Lesson', icon: PlusCircle, path: '/teacher/create' },
    { name: 'My Lessons', icon: FileText, path: '/teacher/lessons' },
    { name: 'Live Class', icon: Video, path: '/teacher/live' },
    { name: 'Translate', icon: Languages, path: '/teacher/translate' },
    { name: 'Student Interaction', icon: MessageSquare, path: '/teacher/chat' },
    { name: 'Analytics', icon: BarChart, path: '/teacher/analytics' },
    { name: 'Reminders', icon: Bell, path: '/teacher/reminders' },
  ];

  return (
    <div className="teacher-sidebar-inner" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--spacing-xl) 10px' }}>
      
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
        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '1px' }}>FOR TEACHERS</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `teacher-nav-item ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isActive ? 'white' : 'var(--color-text-main)',
              background: isActive ? 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))' : 'transparent',
              boxShadow: isActive ? 'var(--shadow-neu-outer-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            })}
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        
        <select 
          className="input-field"
          style={{ cursor: 'pointer', fontWeight: 600, padding: '10px 16px' }}
        >
          <option value="English">🌐 English</option>
          <option value="Hindi">🌐 Hindi</option>
          <option value="Bengali">🌐 Bengali</option>
        </select>

        <Card style={{ padding: 'var(--spacing-md)', background: 'var(--grad-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Leaf size={16} color="var(--color-secondary)" />
          </div>
          <p style={{ margin: 0, fontSize: 'var(--fs-small)', fontWeight: 600, color: 'var(--color-primary-dark)', fontStyle: 'italic' }}>
            “Teachers Plant Seeds That Grow Forever.”
          </p>
        </Card>
      </div>
      
    </div>
  );
};

export default TeacherSidebar;
