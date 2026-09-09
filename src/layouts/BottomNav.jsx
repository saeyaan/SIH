import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, Languages, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = () => {
  const { t } = useLanguage();

  const navItems = [
    { name: t('nav.home'), icon: Home, path: '/' },
    { name: t('nav.learn'), icon: BookOpen, path: '/learn' },
    { name: t('nav.askAI'), icon: MessageSquare, path: '/ask-ai' },
    { name: t('nav.translate'), icon: Languages, path: '/translate' },
    { name: t('nav.profile'), icon: User, path: '/profile' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path}
          className={({ isActive }) => `bottom-nav-item ${isActive || (item.path === '/' && window.location.pathname === '') ? 'active' : ''}`}
        >
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <item.icon size={22} strokeWidth={2.5} />
            <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 600 }}>{item.name}</span>
          </div>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
