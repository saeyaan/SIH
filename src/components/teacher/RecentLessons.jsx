import React from 'react';
import Card from '../Card';
import { BookOpen, Leaf, Calculator, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentLessons = () => {
  const navigate = useNavigate();

  const lessons = [
    { name: 'The Water Cycle', class: 'Class 4', subject: 'Science', icon: Globe, color: '#5e5ce6', date: '2 Sep 2026' },
    { name: 'Our Environment', class: 'Class 3', subject: 'EVS', icon: Leaf, color: '#34c759', date: '1 Sep 2026' },
    { name: 'Addition and Subtraction', class: 'Class 4', subject: 'Mathematics', icon: Calculator, color: '#ff9500', date: '30 Aug 2026' },
    { name: 'Healthy Habits', class: 'Class 3', subject: 'General Knowledge', icon: BookOpen, color: '#ff3b30', date: '28 Aug 2026' },
  ];

  return (
    <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: 'var(--fs-h3)' }}>Recent Lessons</h3>
        <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/teacher/lessons')}>View All</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lessons.map((lesson, idx) => (
          <div 
            key={idx}
            className="card-inner"
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: 'var(--color-bg-card)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${lesson.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <lesson.icon size={20} color={lesson.color} />
                </div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)' }}>{lesson.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{lesson.class} · {lesson.subject}</span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{lesson.date}</span>
                <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                    <ChevronRight size={20} />
                </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentLessons;
