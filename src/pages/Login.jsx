import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { useApp } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Student');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { setUser } = useApp();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      addToast('Please enter both email and password', 'error');
      return;
    }
    
    // Simulate login
    setUser(prev => ({ ...prev, role: role.toLowerCase() }));
    addToast('Welcome back!', 'success');
    
    if (role === 'Teacher') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/');
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
          <h2>Welcome Back</h2>
          <p>Sign in to continue learning</p>
        </div>

        {/* LT-006: Removed 'Admin' from role options to prevent unauthorized role claim */}
        <div style={{ display: 'flex', gap: '10px', background: 'var(--color-bg-input)', padding: '6px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--spacing-xl)' }}>
          {['Student', 'Teacher'].map(r => (
            <button 
              key={r}
              onClick={() => setRole(r)}
              style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 'var(--radius-full)', background: role === r ? 'var(--color-bg-card)' : 'transparent', color: role === r ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: role === r ? 700 : 500, boxShadow: role === r ? 'var(--shadow-neu-outer-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <a href="#" style={{ fontSize: 'var(--fs-small)', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</a>
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

          <Button variant="primary" type="submit" style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
            Log In
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
