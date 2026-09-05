import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Globe, Save, Loader2, Moon, Sun } from 'lucide-react';

const Profile = () => {
  const { user, setUser, theme, toggleTheme } = useApp();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || 'student@bhashasetu.app',
    primaryLanguage: user.primaryLanguage,
    secondaryLanguage: user.secondaryLanguage
  });
  const [isSaving, setIsSaving] = useState(false);

  const languages = ['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi'];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }
    // LT-031: Use proper regex validation instead of just checking for '@'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSaving(true);
    
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email,
        primaryLanguage: formData.primaryLanguage,
        secondaryLanguage: formData.secondaryLanguage
      }));
      setIsSaving(false);
      addToast('Your preferences have been saved!', 'success');
    }, 1500);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ width: '100%', maxWidth: '600px', marginBottom: 'var(--spacing-md)' }}>
            <h2 style={{ color: 'var(--color-primary-dark)', margin: 0 }}>My Profile</h2>
            <p style={{ margin: 0, fontSize: 'var(--fs-small)' }}>Manage your account and learning preferences</p>
        </div>

        <Card style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-neu-outer-sm)' }}>
              <User size={40} color="white" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--color-text-main)' }}>{user.name}</h3>
              <p style={{ margin: 0, color: 'var(--color-primary)' }}>{user.class} • Student</p>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div className="card-inner" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="form-group">
                <label className="form-label">
                    <User size={16} /> Full Name
                </label>
                <input 
                    type="text" 
                    name="name"
                    className="input-field"
                    value={formData.name}
                    onChange={handleChange}
                />
                </div>

                <div className="form-group">
                <label className="form-label">
                    <Mail size={16} /> Email Address
                </label>
                <input 
                    type="email" 
                    name="email"
                    className="input-field"
                    value={formData.email}
                    onChange={handleChange}
                />
                </div>
            </div>

            <div className="card-inner" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="form-group">
                <label className="form-label">
                    <Globe size={16} /> Primary Learning Language
                </label>
                <select 
                    name="primaryLanguage"
                    className="input-field"
                    value={formData.primaryLanguage}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                >
                    {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
                </div>

                <div className="form-group">
                <label className="form-label">
                    <Globe size={16} /> Also Comfortable With
                </label>
                <select 
                    name="secondaryLanguage"
                    className="input-field"
                    value={formData.secondaryLanguage}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                >
                    <option value="">Select a language</option>
                    {languages.map(lang => (
                    <option key={lang} value={lang} disabled={lang === formData.primaryLanguage}>{lang}</option>
                    ))}
                </select>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-md) 0', borderTop: '1px solid var(--color-border)', marginBottom: 'var(--spacing-md)' }}>
                <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Theme Preference</span>
                <Button variant="secondary" onClick={toggleTheme} type="button" style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 16px' }}>
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />} 
                    <span className="hide-on-mobile">{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
                </Button>
            </div>

            <Button variant="primary" type="submit" disabled={isSaving} style={{ display: 'flex', justifyContent: 'center' }}>
              {isSaving ? (
                <><Loader2 size={20} className="spin-animation" /> Saving...</>
              ) : (
                <><Save size={20} /> Save Preferences</>
              )}
            </Button>

          </form>
        </Card>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .hide-on-mobile { display: none; }
        }
      `}</style>
    </>
  );
};

export default Profile;
