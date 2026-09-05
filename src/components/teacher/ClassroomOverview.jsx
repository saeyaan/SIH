import React from 'react';
import Card from '../Card';
import { ChevronDown } from 'lucide-react';

const ClassroomOverview = () => {
  const stats = [
    { label: 'Total Students', value: '86' },
    { label: 'Active Students', value: '74' },
    { label: 'Lessons Shared', value: '12' },
    { label: 'Live Classes', value: '4' },
  ];

  return (
    <Card style={{ padding: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)' }}>Classroom Overview</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>This Month</span>
            <ChevronDown size={14} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="card-inner" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-input)' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary-dark)' }}>{stat.value}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', fontWeight: 600 }}>{stat.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ClassroomOverview;
