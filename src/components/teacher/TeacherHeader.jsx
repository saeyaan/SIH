import { supabase } from '../../lib/supabaseClient';
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const TeacherHeader = () => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // LT-026: Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if(supabase) await supabase.auth.signOut();
    navigate('/login');
  };

  // LT-013: Derive teacher display name from user context
  const teacherName = user?.name || 'Teacher';
  const teacherInitial = teacherName.charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)', position: 'relative' }}>
      
      <div style={{ flex: 1, maxWidth: '500px', position: 'relative' }}>
        <Search size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search students, lessons, topics..." 
          className="input-field"
          style={{ paddingLeft: '48px', borderRadius: 'var(--radius-full)' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        
        <button style={{ position: 'relative', background: 'var(--color-bg-card)', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-neu-outer-sm)' }}>
          <Bell size={20} color="var(--color-text-main)" />
          <span style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', background: 'var(--color-danger)', borderRadius: '50%' }}></span>
        </button>

        {/* LT-013: Use dynamic user context, LT-026: click-outside ref */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'var(--color-bg-card)', padding: '6px 16px 6px 6px', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-neu-outer-sm)' }}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                    {teacherInitial}
                </div>
                <div className="hide-on-mobile">
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.2 }}>Hi, {teacherName}!</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.2 }}>Teacher</p>
                </div>
                <ChevronDown size={16} color="var(--color-text-muted)" />
            </div>

            {showDropdown && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '8px', minWidth: '150px', boxShadow: 'var(--shadow-soft)', zIndex: 50, border: '1px solid var(--color-border)' }}>
                    {/* LT-027: Wire up Profile and Settings buttons */}
                    <button onClick={() => { navigate('/profile'); setShowDropdown(false); }} style={{ display: 'block', width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--fs-small)', color: 'var(--color-text-main)' }}>Profile</button>
                    <button style={{ display: 'block', width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--fs-small)', color: 'var(--color-text-main)' }}>Settings</button>
                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }}></div>
                    <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--fs-small)', color: 'var(--color-danger)', fontWeight: 600 }}>Logout</button>
                </div>
            )}
        </div>

      </div>

      <style>{`
        @media (max-width: 600px) {
            .hide-on-mobile { display: none; }
        }
      `}</style>
    </div>
  );
};

export default TeacherHeader;
