import React from 'react';
import Card from '../Card';
import LanguageChart from './LanguageChart';
import { TrendingUp, Users, BookOpen, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card style={{ flex: '1', minWidth: '200px', padding: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
    <div style={{ background: color, padding: '12px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-neu-inner)' }}>
      <Icon size={24} />
    </div>
    <div>
      <h4 style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{title}</h4>
      <p style={{ margin: '4px 0 0 0', color: 'var(--color-primary-dark)', fontSize: '1.5rem', fontWeight: 800 }}>{value}</p>
    </div>
  </Card>
);

const TeacherAnalytics = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
        <StatCard title="Total Students" value="145" icon={Users} color="var(--color-primary)" />
        <StatCard title="Active Lessons" value="24" icon={BookOpen} color="var(--color-secondary)" />
        <StatCard title="Avg. Score" value="82%" icon={TrendingUp} color="var(--color-success)" />
        <StatCard title="Study Hours" value="1,240" icon={Clock} color="var(--color-accent)" />
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <LanguageChart />
        </div>
        
        <Card style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: 'var(--color-primary-dark)', margin: '0 0 var(--spacing-md) 0' }}>Top Performing Classes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {['Class 5 - Science', 'Class 4 - Maths', 'Class 3 - EVS', 'Class 5 - English'].map((cls, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{cls}</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{95 - i * 4}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
