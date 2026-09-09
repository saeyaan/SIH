import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Globe, Save, Loader2, Key } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Profile = ({ forceRole }) => {
  const { user, setUser } = useApp();
  const { addToast } = useToast();
  const { t } = useLanguage();
  
  const isTeacher = forceRole === 'teacher' || (!forceRole && user?.role === 'teacher');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    primaryLanguage: user?.primaryLanguage || 'English',
    secondaryLanguage: user?.secondaryLanguage || 'English',
    teachingLanguage: user?.teachingLanguage || 'Hindi'
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        primaryLanguage: user.primaryLanguage || 'English',
        secondaryLanguage: user.secondaryLanguage || 'English',
        teachingLanguage: user.teachingLanguage || 'Hindi'
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    
    try {
      const updates = {
        name: formData.name,
        // Optional JSON fields if you decide to add them to your DB later, 
        // but for now we only update 'name' as it's the only one in the strict schema.
        // We do not update email directly here because Supabase requires a specific auth flow for email change.
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;

      // Update local state (preserving existing fields like student_code, teacher_id)
      setUser({ ...user, ...updates, ...formData });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}><Loader2 className="spin-animation" size={32} /></div>;
  }

  return (
    <div style={{ padding: 'var(--spacing-md)', maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-md)' }}>{t('profile.myProfile')}</h2>
        
        <Card style={{ marginBottom: 'var(--spacing-lg)', border: '1px solid white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ 
                    width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '2rem',
                    boxShadow: 'var(--shadow-neu-outer-sm)', border: '2px solid white'
                }}>
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', color: 'var(--color-text-main)' }}>{user?.name || 'User'}</h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ 
                            background: 'var(--color-accent-light)', color: 'var(--color-primary-dark)', 
                            padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 
                        }}>
                            {isTeacher ? 'Teacher Account' : 'Student Account'}
                        </span>
                        <span style={{ 
                            background: 'var(--color-bg-input)', color: 'var(--color-text-muted)', 
                            padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--color-border)' 
                        }}>
                            {isTeacher ? `Teacher ID: ${user?.teacher_id || 'TCH-000'}` : `Student Code: ${user?.student_code || 'STU-000'}`}
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
                    <div className="input-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                            <User size={16} color="var(--color-primary)" /> {t('profile.fullName')}
                        </label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name} 
                            onChange={handleChange}
                            style={{ 
                                width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', 
                                border: '1px solid var(--color-border)', background: 'var(--color-bg-input)',
                                color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none'
                            }}
                        />
                    </div>
                    
                    <div className="input-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                            <Mail size={16} color="var(--color-primary)" /> {t('profile.email')}
                        </label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email} 
                            disabled
                            style={{ 
                                width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', 
                                border: '1px solid var(--color-border)', background: 'var(--color-bg-input)',
                                color: 'var(--color-text-muted)', fontSize: '1rem', outline: 'none', cursor: 'not-allowed'
                            }}
                        />
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                            <Globe size={16} color="var(--color-primary)" /> {t('profile.primaryLang')}
                        </label>
                        <select 
                            name="primaryLanguage"
                            value={formData.primaryLanguage}
                            onChange={handleChange}
                            style={{ 
                                width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', 
                                border: '1px solid var(--color-border)', background: 'var(--color-bg-input)',
                                color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none', cursor: 'pointer'
                            }}
                        >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Bengali">Bengali</option>
                        </select>
                    </div>

                    {isTeacher ? (
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                                <Globe size={16} color="var(--color-secondary)" /> Teaching Language
                            </label>
                            <select 
                                name="teachingLanguage"
                                value={formData.teachingLanguage}
                                onChange={handleChange}
                                style={{ 
                                    width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', 
                                    border: '1px solid var(--color-border)', background: 'var(--color-bg-input)',
                                    color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none', cursor: 'pointer'
                                }}
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Bengali">Bengali</option>
                            </select>
                        </div>
                    ) : (
                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                                <Globe size={16} color="var(--color-secondary)" /> {t('profile.learningLang')}
                            </label>
                            <select 
                                name="secondaryLanguage"
                                value={formData.secondaryLanguage}
                                onChange={handleChange}
                                style={{ 
                                    width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', 
                                    border: '1px solid var(--color-border)', background: 'var(--color-bg-input)',
                                    color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none', cursor: 'pointer'
                                }}
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Bengali">Bengali</option>
                            </select>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
                    <Button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                        {saving ? <Loader2 size={18} className="spin-animation" /> : <Save size={18} />}
                        {saving ? 'Saving...' : t('common.save') || 'Save'}
                    </Button>
                </div>
            </form>
        </Card>
    </div>
  );
};

export default Profile;
