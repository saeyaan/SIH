import React, { useState } from 'react';
import { ArrowRight, Heart, Sun } from 'lucide-react';
import Button from '../Button';
import CreateLessonModal from './CreateLessonModal';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
// LT-041: Use a try/catch for the image import so a missing asset doesn't break the build
let teacherImg = null;
try {
  teacherImg = new URL('../../assets/images/teacher_hero.jpg', import.meta.url).href;
} catch (e) {
  teacherImg = null;
}

const TeacherHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();
  const { user } = useApp();
  // LT-014: Use user context for teacher name
  const teacherName = user?.name || 'Teacher';

  return (
    <>
      <div style={{ 
        background: 'linear-gradient(135deg, #e8f0fe 0%, #f3f6ff 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-xl)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-neu-outer-sm)',
        border: '1px solid white'
      }}>
        <div className="teacher-hero-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr auto 1fr', 
            gap: 'var(--spacing-lg)',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
        }}>
            
            {/* Left Section */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-h3)', margin: '0 0 4px 0' }}>{t('home.welcome')},</p>
                <h1 style={{ color: 'var(--color-primary-dark)', fontSize: 'clamp(2rem, 3vw, 2.5rem)', margin: '0 0 var(--spacing-sm) 0', lineHeight: 1.1 }}>
                    {teacherName}!
                </h1>
                <p style={{ color: 'var(--color-text-main)', fontSize: 'var(--fs-body)', fontWeight: 500, margin: '0 0 var(--spacing-lg) 0', maxWidth: '280px' }}>
                    Empower every child with the language they understand.
                </p>
                
                <div style={{ alignSelf: 'flex-start' }}>
                    <Button variant="primary" onClick={() => setIsModalOpen(true)} style={{ padding: '12px 24px', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}>
                        {t('teacher.createLessonTitle')} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </Button>
                </div>
            </div>

            {/* Center Section - Illustration */}
            <div className="teacher-hero-img" style={{ 
                position: 'relative',
                width: '320px',
                height: '320px',
                margin: '0 -40px',
                zIndex: 1,
                alignSelf: 'flex-end',
                transform: 'translateY(24px)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: teacherImg ? `url("${teacherImg}")` : 'none',
                    backgroundColor: teacherImg ? 'transparent' : 'var(--color-secondary)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '50%',
                    boxShadow: 'inset 0 0 40px 20px #edf2fe, inset 0 0 60px 40px #edf2fe'
                }}></div>
            </div>

            {/* Right Section - Quote */}
            <div className="teacher-hero-quote" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', zIndex: 2 }}>
                
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)', transform: 'translateX(-20px)' }}>
                    <h3 style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', color: 'var(--color-primary-light)', margin: 0, fontSize: '1.4rem', transform: 'rotate(-5deg)' }}>
                        Different Languages
                    </h3>
                    <h3 style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', color: 'var(--color-primary-light)', margin: 0, fontSize: '1.4rem', transform: 'rotate(-5deg)' }}>
                        Same Dreams <Heart size={16} fill="#ffb3d6" color="#ffb3d6" style={{ display: 'inline', marginLeft: '4px' }} />
                    </h3>
                </div>

                <div className="card-inner teacher-hero-quote-box" style={{ 
                    background: 'rgba(255, 255, 255, 0.7)', 
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'var(--shadow-soft)', 
                    border: '1px solid white', 
                    padding: 'var(--spacing-lg)', 
                    borderRadius: 'var(--radius-lg)',
                    maxWidth: '280px',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)' }}>
                        <Sun size={32} color="var(--color-accent)" fill="var(--color-accent-light)" />
                    </div>
                    <p style={{ color: 'var(--color-text-main)', fontSize: '0.9rem', fontWeight: 600, margin: '16px 0 0 0', lineHeight: 1.5 }}>
                        “Education is brighter when it speaks every child's language.”
                    </p>
                </div>
            </div>

        </div>

        <style>{`
          @media (max-width: 900px) {
            .teacher-hero-grid {
               grid-template-columns: 1fr !important;
               text-align: center;
               gap: var(--spacing-xl) !important;
            }
            .teacher-hero-grid > div {
               align-items: center !important;
               text-align: center !important;
            }
            .teacher-hero-img {
               margin: 0 auto !important;
               transform: none !important;
            }
            .teacher-hero-quote {
               transform: none !important;
            }
            .teacher-hero-quote-box {
                margin: 0 auto !important;
            }
          }
        `}</style>
      </div>

      {isModalOpen && <CreateLessonModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default TeacherHero;
