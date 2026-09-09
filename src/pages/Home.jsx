import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { BookOpen, MessageSquare, Mic, Languages, ArrowRight, Folder, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import MyClassesStudent from '../components/student/MyClassesStudent';

const Home = () => {
  const navigate = useNavigate();
  const { user, progress } = useApp();
  const { t } = useLanguage();

  const features = [
    { title: t('feat.learnTitle'), icon: BookOpen, desc: t('feat.learnDesc'), gradient: 'var(--grad-blue)', iconColor: '#5856d6', path: '/learn' },
    { title: t('feat.askTitle'), icon: MessageSquare, desc: t('feat.askDesc'), gradient: 'var(--grad-green)', iconColor: '#34c759', path: '/ask-ai' },
    { title: t('feat.translateTitle'), icon: Languages, desc: t('feat.translateDesc'), gradient: 'var(--grad-orange)', iconColor: '#ff9500', path: '/translate' },
    { title: t('feat.myLessonsTitle'), icon: Folder, desc: t('feat.myLessonsDesc'), gradient: 'var(--grad-blue)', iconColor: '#00c6ff', path: '/my-lessons' },
  ];

  return (
    <>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ color: 'var(--color-text-main)' }}>{t('home.welcome')}, {(user.name || 'Learner').split(' ')[0]}! 👋</h1>
        <p>{t('home.readyToContinue')}</p>
      </div>
      
      <div className="card" style={{ background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', border: 'none', borderRadius: 'var(--radius-xl)', gap: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ color: '#312e81', fontSize: 'var(--fs-h1)', marginBottom: 'var(--spacing-md)', lineHeight: '1.2', whiteSpace: 'pre-line' }}>
            {t('home.heroTitle')}
          </h2>
          <p style={{ color: '#4f46e5', marginBottom: 'var(--spacing-lg)', fontWeight: 500, fontSize: 'var(--fs-body)' }}>
            {t('home.heroSubtitle')}
          </p>
          <Button variant="primary" onClick={() => navigate('/learn')} style={{ background: '#5e5ce6', borderRadius: 'var(--radius-full)' }}>
            {t('home.continueLearning')} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Button>
        </div>
        <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <div style={{ 
                  width: '100%',
                  aspectRatio: '1/1',
                  backgroundImage: 'url("/hero_boy_globe_1788550838455.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 45%, transparent 75%)',
                  maskImage: 'radial-gradient(circle at center, black 45%, transparent 75%)'
              }}></div>
            </div>
        </div>
      </div>

      <MyClassesStudent />
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
                    <span style={{ color: 'var(--color-primary)' }}>📊</span> {t('home.learningJourney')}
                </h3>
            </div>
            
            <div className="card-inner" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
               
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ background: 'var(--color-success-light)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--color-success)', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
                     </div>
                     <div>
                        <h4 style={{ margin: 0, color: 'var(--color-text-main)' }}>{t('home.completedLessons')}</h4>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)' }}>{t('home.greatProgress')}</span>
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
                        <h4 style={{ margin: 0, color: 'var(--color-text-main)' }}>{t('home.inProgress')}</h4>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)' }}>{t('home.keepGoing')}</span>
                     </div>
                  </div>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{Object.keys(progress.inProgressLessons).length}</h3>
               </div>

            </div>
         </Card>

         <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <span style={{ color: '#ffcc00' }}>⭐</span> {t('home.yourBadges')}
                </h3>
                <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/badges')}>{t('home.viewAll')}</span>
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
