import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Bell, User as UserIcon, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { mockNotifications } from '../data/mockData';
import Modal from './Modal';
import Button from './Button';

const Header = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { user, theme, toggleTheme } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setShowSignOut(false);
    addToast('Signed out successfully!', 'success');
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'success');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'Ask AI', path: '/ask-ai' },
    { name: 'Speak', path: '/speak' },
    { name: 'My Lessons', path: '/my-lessons' },
  ];

  return (
    <>
      <header className="app-header">
        {/* Left: Logo (Visible only on Mobile) */}
        <div className="header-logo-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ background: 'var(--color-accent)', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="var(--color-primary-dark)" strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', letterSpacing: '-0.5px', lineHeight: 1 }}>BhashaSetu</span>
          </div>
        </div>

        {/* Spacer for Desktop (if needed) to push actions right */}
        <div style={{ flex: 1 }}></div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ background: 'var(--color-bg-card)', border: '1px solid rgba(255,255,255,0.8)', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-neu-outer-sm)', transition: 'all 0.2s' }}
            >
              <Bell size={20} color="var(--color-text-muted)" />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--color-danger)', color: 'white', fontSize: '0.65rem', minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid var(--color-bg-card)' }}>
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div style={{ position: 'absolute', top: '120%', right: 0, width: '320px', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-neu-outer)', border: '1px solid white', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', zIndex: 110 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--color-text-main)' }}>Notifications</h4>
                  {unreadCount > 0 && <button style={{ fontSize: '0.8rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={markAllRead}>Mark all read</button>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '12px', background: n.read ? 'transparent' : 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', border: n.read ? 'none' : '1px solid rgba(255,255,255,0.5)' }}>
                      <h5 style={{ margin: '0 0 4px 0', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>{n.title}</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{n.message}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-light)', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{n.time}</span>
                    </div>
                  ))}
                  {notifications.length === 0 && <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>No notifications</p>}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                background: 'var(--color-bg-card)', padding: '4px 12px 4px 4px', borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-neu-outer-sm)', border: '1px solid rgba(255,255,255,0.8)'
              }}
            >
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {isDesktop && <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--color-text-main)' }}>{(user.name || 'User').split(' ')[0]}</span>}
            </div>
            
            {showProfileMenu && (
              <div style={{ position: 'absolute', top: '120%', right: 0, width: '220px', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-neu-outer)', border: '1px solid white', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-sm)', zIndex: 110, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                  <span style={{ display: 'block', fontWeight: 'bold', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>{user.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email || 'student@bhashasetu.app'}</span>
                </div>
                
                <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="menu-btn">
                  <UserIcon size={16} /> My Profile
                </button>
                <button onClick={() => { toggleTheme(); setShowProfileMenu(false); }} className="menu-btn">
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} 
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }}></div>
                <button onClick={() => { setShowSignOut(true); setShowProfileMenu(false); }} className="menu-btn text-danger">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
          
        </div>
      </header>

      <Modal isOpen={showSignOut} onClose={() => setShowSignOut(false)} title="Sign Out">
        <p>Are you sure you want to sign out of your account?</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="secondary" onClick={() => setShowSignOut(false)} style={{ flex: 1 }}>Cancel</Button>
          <Button variant="primary" onClick={handleSignOut} style={{ flex: 1, background: 'var(--color-danger)' }}>Sign Out</Button>
        </div>
      </Modal>

      <style>{`
        @media (min-width: 768px) {
            .header-logo-mobile {
                display: none !important;
            }
        }
        .menu-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          text-align: left;
          color: var(--color-text-main);
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.2s;
        }
        .menu-btn:hover {
          background: var(--color-bg-input);
        }
        .menu-btn.text-danger {
          color: var(--color-danger);
        }
      `}</style>
    </>
  );
};

export default Header;
