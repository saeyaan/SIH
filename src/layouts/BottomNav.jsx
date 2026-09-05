import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, Mic, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Learn', icon: BookOpen, path: '/learn' },
    { name: 'Ask AI', icon: MessageSquare, path: '/ask-ai' },
    { name: 'Speak', icon: Mic, path: '/speak' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink 
          key={item.name} 
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
