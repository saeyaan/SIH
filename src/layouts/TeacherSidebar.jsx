import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, PlusCircle, FileText, Languages, MessageSquare, BarChart, Bell, BookOpen, Leaf, User } from 'lucide-react';
import Card from '../components/Card';
import { useLanguage } from '../context/LanguageContext';

const TeacherSidebar = () => {
  const { t, uiLanguage, setUiLanguage } = useLanguage();

  const navItems = [
    { name: t('nav.home'), icon: Home, path: '/teacher/dashboard' },
    { name: t('nav.myClasses'), icon: Users, path: '/teacher/classes' },
    { name: t('nav.createLesson'), icon: PlusCircle, path: '/teacher/create' },
    { name: t('nav.translate'), icon: Languages, path: '/teacher/translate' },
    { name: t('nav.studentInteraction'), icon: MessageSquare, path: '/teacher/chat' },
    { name: t('nav.analytics'), icon: BarChart, path: '/teacher/analytics' },
    { name: t('nav.reminders'), icon: Bell, path: '/teacher/reminders' },
    { name: t('nav.profile'), icon: User, path: '/teacher/profile' },
  ];

  return (
    <div className="teacher-sidebar-inner" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--spacing-xl) 10px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--spacing-xl)', padding: '0 10px' }}>
        <div style={{ background: 'var(--color-accent)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={20} color="var(--color-primary-dark)" strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 'var(--fs-h3)', color: 'var(--color-primary-dark)' }}>{t('common.bhashaSetu')}</h2>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>{t('common.everyChildLearns')}</span>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-md)', padding: '0 10px' }}>
        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '1px' }}>{t('common.forTeachers')}</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
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
          value={uiLanguage}
          onChange={(e) => setUiLanguage(e.target.value)}
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
            {t('teacher.quote')}
          </p>
        </Card>
      </div>
      
    </div>
  );
};

export default TeacherSidebar;
