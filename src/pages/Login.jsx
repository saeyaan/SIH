import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!supabase) {
      addToast('Supabase configuration is missing. Cannot login.', 'error');
      return;
    }

    if (!formData.email || !formData.password) {
      addToast('Please enter both email and password', 'error');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      addToast('Logged in successfully!', 'success');
      // Navigation is handled automatically by AuthGuard / AppContext listener
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Invalid email or password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
            <ArrowLeft size={20} /> Back
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ background: 'var(--color-primary)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-sm) auto' }}>
            <BookOpen size={32} color="white" strokeWidth={2.5} />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue learning</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                placeholder="Enter your password"
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

          <Button variant="primary" type="submit" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spin-animation" size={20} /> : 'Log In'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
          <p style={{ fontSize: 'var(--fs-small)' }}>
            Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
