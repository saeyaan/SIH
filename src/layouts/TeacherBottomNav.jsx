import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, PlusCircle, FileText, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TeacherBottomNav = () => {
  const { t } = useLanguage();

  return (
    <>
      <nav className="bottom-nav hide-on-desktop">
        <NavLink to="/teacher/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>{t('nav.home')}</span>
        </NavLink>
        
        <NavLink to="/teacher/classes" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>{t('nav.myClasses')}</span>
        </NavLink>
        
        <NavLink to="/teacher/create" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative', top: '-15px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))', 
            width: '48px', height: '48px', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', boxShadow: '0 4px 15px rgba(88, 86, 214, 0.4)'
          }}>
            <PlusCircle size={24} />
          </div>
          <span style={{ marginTop: '4px', fontWeight: 700, color: 'var(--color-primary)' }}>{t('nav.createLesson').split(' ')[0]}</span>
        </NavLink>
        

        
        <NavLink to="/teacher/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <User size={20} />
          <span>{t('nav.profile')}</span>
        </NavLink>
      </nav>

      <style>{`
        .hide-on-desktop {
          display: flex;
        }
        @media (min-width: 768px) {
          .hide-on-desktop {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default TeacherBottomNav;
