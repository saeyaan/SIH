import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabaseClient';

const Signup = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '', institution: '', terms: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!supabase) {
      addToast('Supabase configuration is missing. Cannot sign up.', 'error');
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    if (formData.password !== formData.confirm) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (!formData.terms) {
      addToast('Please accept the Terms and Privacy Policy', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const roleName = role.toLowerCase();
      const studentCode = roleName === 'student' ? 'STU-' + Math.floor(Math.random() * 10000) : null;
      const teacherId = roleName === 'teacher' ? 'TCH-' + Math.floor(Math.random() * 10000) : null;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: roleName,
            student_code: studentCode,
            teacher_id: teacherId
          }
        }
      });

      if (error) throw error;

      addToast('Account created successfully!', 'success');
      
      // If there's no session, it means email confirmation is required.
      if (!data?.session) {
         addToast('Please check your email to confirm your account.', 'info');
         navigate('/login');
      }
      // If there IS a session, AppContext will detect it and auto-redirect.

    } catch (err) {
      console.error(err);
      addToast(err.message || 'Account creation failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
            <ArrowLeft size={20} /> Back
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ background: 'var(--color-primary)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-sm) auto' }}>
            <BookOpen size={32} color="white" strokeWidth={2.5} />
          </div>
          <h2>Create Your Account</h2>
          <p>Join BhashaSetu and start learning</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', background: 'var(--color-bg-input)', padding: '6px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--spacing-xl)' }}>
          {['Student', 'Teacher'].map(r => (
            <button 
              key={r}
              onClick={() => setRole(r)}
              type="button"
              style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 'var(--radius-full)', background: role === r ? 'var(--color-bg-card)' : 'transparent', color: role === r ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: role === r ? 700 : 500, boxShadow: role === r ? 'var(--shadow-neu-outer-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSignup}>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter your full name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder={`Enter your ${role.toLowerCase()} email`}
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                placeholder="Create a password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-field" 
              placeholder="Confirm your password"
              value={formData.confirm}
              onChange={e => setFormData({ ...formData, confirm: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <input 
                type="checkbox" 
                id="terms" 
                checked={formData.terms}
                onChange={e => setFormData({ ...formData, terms: e.target.checked })}
                style={{ marginTop: '4px', cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', lineHeight: 1.4, cursor: 'pointer' }}>
                  I agree to the <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Privacy Policy</span>.
              </label>
          </div>

          <Button variant="primary" type="submit" style={{ width: '100%' }} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spin-animation" size={20} /> : 'Sign Up'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
          <p style={{ fontSize: 'var(--fs-small)' }}>
            Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}>Log In</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
