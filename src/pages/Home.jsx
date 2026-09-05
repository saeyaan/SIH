import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { BookOpen, MessageSquare, Mic, Languages, ArrowRight, Video, Folder, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, progress } = useApp();

  const features = [
    { title: 'Learn', icon: BookOpen, desc: 'Explore lessons in your language', gradient: 'var(--grad-blue)', iconColor: '#5856d6', path: '/learn' },
    { title: 'Ask AI', icon: MessageSquare, desc: 'Get simple answers to your questions', gradient: 'var(--grad-green)', iconColor: '#34c759', path: '/ask-ai' },
    { title: 'Speak', icon: Mic, desc: 'Ask using your voice', gradient: 'var(--grad-pink)', iconColor: '#ff3b30', path: '/speak' },
    { title: 'Translate', icon: Languages, desc: 'Understand in your language', gradient: 'var(--grad-orange)', iconColor: '#ff9500', path: '/translate' },
    { title: 'Live Class', icon: Video, desc: 'Join real-time translated classes', gradient: 'var(--grad-blue)', iconColor: '#5e5ce6', path: '/live-class' },
    { title: 'My Lessons', icon: Folder, desc: 'Continue where you left off', gradient: 'var(--grad-blue)', iconColor: '#00c6ff', path: '/my-lessons' },
  ];

  return (
    <>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ color: 'var(--color-text-main)' }}>Welcome back, {(user.name || 'Learner').split(' ')[0]}! 👋</h1>
        <p>Ready to continue your learning journey?</p>
      </div>
      
      <div className="card" style={{ background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', border: 'none', borderRadius: 'var(--radius-xl)', gap: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ color: '#312e81', fontSize: 'var(--fs-h1)', marginBottom: 'var(--spacing-md)', lineHeight: '1.2' }}>
            Learn Without Limits<br />
            In Your Own Language
          </h2>
          <p style={{ color: '#4f46e5', marginBottom: 'var(--spacing-lg)', fontWeight: 500, fontSize: 'var(--fs-body)' }}>
            AI-powered learning for a brighter tomorrow.
          </p>
          <Button variant="primary" onClick={() => navigate('/learn')} style={{ background: '#5e5ce6', borderRadius: 'var(--radius-full)' }}>
            Continue Learning <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Button>
        </div>
        <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
              <img 
                src="/hero_boy_globe_1788550838455.jpg" 
                alt="Hero Illustration" 
                onError={(e) => { e.target.style.display = 'none'; }}
                style={{ 
                  width: '100%', 
                  display: 'block',
                  objectFit: 'cover'
                }} 
              />
              <div style={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, bottom: 0, 
                boxShadow: 'inset 0 0 50px 30px #e4ebfa',
                pointerEvents: 'none'
              }} />
            </div>
        </div>
      </div>

      <div className="grid-features" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {features.map((feat) => (
          <Card key={feat.title} style={{ background: feat.gradient, display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer', border: 'none' }} onClick={() => navigate(feat.path)}>
            <div style={{ 
              background: 'rgba(255,255,255,0.6)', 
              width: '50px', height: '50px', 
              borderRadius: '15px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-neu-outer-sm)'
            }}>
              <feat.icon size={28} color={feat.iconColor} />
            </div>
            <h3 style={{ color: 'var(--color-primary-dark)' }}>{feat.title}</h3>
            <p style={{ color: 'var(--color-primary-dark)', opacity: 0.8, fontSize: '0.9rem', flex: 1 }}>{feat.desc}</p>
            <div style={{ alignSelf: 'flex-end', marginTop: '1rem' }}>
               <button style={{ background: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-neu-outer-sm)' }}>
                  <ArrowRight size={16} color="var(--color-primary)" />
               </button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid-cols-2">
         <Card style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <span style={{ color: 'var(--color-primary)' }}>📊</span> Your Learning Journey
                </h3>
            </div>
            
            <div className="card-inner" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
               
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ background: 'var(--color-success-light)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--color-success)', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
                     </div>
                     <div>
                        <h4 style={{ margin: 0, color: 'var(--color-text-main)' }}>Completed Lessons</h4>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)' }}>Great progress!</span>
                     </div>
                  </div>
                  <h3 style={{ margin: 0, color: 'var(--color-success)' }}>{progress.completedLessons.length}</h3>
               </div>

               <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }}></div>

               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ background: 'var(--color-primary-light)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>...</span>
                     </div>
                     <div>
                        <h4 style={{ margin: 0, color: 'var(--color-text-main)' }}>In Progress</h4>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)' }}>Keep going!</span>
                     </div>
                  </div>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{Object.keys(progress.inProgressLessons).length}</h3>
               </div>

            </div>
         </Card>

         <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <span style={{ color: '#ffcc00' }}>⭐</span> Your Badges
                </h3>
                <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/badges')}>View All</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="card-inner" style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-light)' }}>
                        <span style={{ color: 'white', fontSize: 'var(--fs-h2)' }}>★</span>
                    </div>
                    <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.2 }}>Curious<br/>Learner</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="card-inner" style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-success-light)' }}>
                        <span style={{ color: 'var(--color-success)', fontSize: 'var(--fs-h2)' }}>🛡️</span>
                    </div>
                    <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.2 }}>Language<br/>Explorer</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="card-inner" style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-warning-light)' }}>
                        <span style={{ color: 'var(--color-warning)', fontSize: 'var(--fs-h2)' }}>🌟</span>
                    </div>
                    <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.2 }}>Bright<br/>Mind</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="card-inner" style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-page)' }}>
                        <Lock size={20} color="var(--color-text-muted)" />
                    </div>
                    <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.2 }}>More<br/>Badges</span>
                </div>
            </div>
         </Card>
      </div>

      <style>{`
        .grid-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
        }
        @media (min-width: 768px) {
          .grid-features {
            grid-template-columns: repeat(3, 1fr);
            gap: var(--spacing-lg);
          }
        }
        @media (min-width: 1024px) {
          .grid-features {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>
    </>
  );
};

export default Home;
