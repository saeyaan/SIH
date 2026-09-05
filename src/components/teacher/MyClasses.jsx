import React from 'react';
import Card from '../Card';
import { Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyClasses = () => {
  const navigate = useNavigate();

  const classes = [
    { name: 'Class 4 - A', students: 28, color: 'var(--color-primary)' },
    { name: 'Class 3 - B', students: 32, color: 'var(--color-secondary)' },
    { name: 'Class 5 - A', students: 26, color: 'var(--color-accent)' },
  ];

  return (
    <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: 'var(--fs-h3)' }}>My Classes</h3>
        <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/teacher/classes')}>View All</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {classes.map((cls, idx) => (
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
            onClick={() => navigate(`/teacher/classes/${idx}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${cls.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} color={cls.color} />
                </div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)' }}>{cls.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{cls.students} Students</span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-bg-input)', border: '2px solid white', marginLeft: i > 1 ? '-10px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', zIndex: 4-i }}>
                            👤
                        </div>
                    ))}
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-bg-input)', border: '2px solid white', marginLeft: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                        +{cls.students - 3}
                    </div>
                </div>
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

export default MyClasses;
