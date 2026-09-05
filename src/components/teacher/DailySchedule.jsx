import React from 'react';
import Card from '../Card';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DailySchedule = () => {
  const navigate = useNavigate();

  const schedule = [
    { time: '09:00 AM', title: 'Class 4 - Science', subtitle: 'Live Class', color: 'var(--color-primary)' },
    { time: '11:00 AM', title: 'Class 3 - EVS', subtitle: 'Share Lesson', color: 'var(--color-secondary)' },
    { time: '01:00 PM', title: 'Prepare Lesson', subtitle: 'Mathematics (Class 4)', color: 'var(--color-accent)' },
    { time: '03:00 PM', title: 'Review Student Activity', subtitle: 'Class 3', color: 'var(--color-danger)' },
  ];

  return (
    <Card style={{ padding: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)' }}>Tue, 2 Sep 2026</h4>
        <button style={{ background: 'var(--color-bg-input)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-primary)' }}>
            <CalendarIcon size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {schedule.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
            
            {/* Timeline Line */}
            {idx < schedule.length - 1 && (
                <div style={{ position: 'absolute', left: '5px', top: '24px', bottom: '-16px', width: '2px', background: 'var(--color-border)' }}></div>
            )}
            
            {/* Timeline Dot */}
            <div style={{ marginTop: '4px', width: '12px', height: '12px', borderRadius: '50%', background: item.color, border: '2px solid white', boxShadow: '0 0 0 2px var(--color-bg-input)', zIndex: 1 }}></div>

            <div style={{ flex: 1, paddingBottom: idx === schedule.length - 1 ? 0 : 'var(--spacing-md)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{item.time}</span>
                <h5 style={{ margin: '4px 0', fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{item.title}</h5>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        style={{ width: '100%', marginTop: 'var(--spacing-lg)', background: 'var(--color-bg-input)', border: 'none', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
        onClick={() => navigate('/teacher/schedule')}
      >
        View Full Schedule <ArrowRight size={16} />
      </button>
    </Card>
  );
};

export default DailySchedule;
