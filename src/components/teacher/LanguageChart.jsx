import React from 'react';
import Card from '../Card';

const LanguageChart = () => {
  const languages = [
    { name: 'Bengali', percent: 38, color: '#5856d6' },
    { name: 'Hindi', percent: 26, color: '#34c759' },
    { name: 'Tamil', percent: 18, color: '#ff9500' },
    { name: 'Telugu', percent: 10, color: '#ff3b30' },
    { name: 'Others', percent: 8, color: '#a3b1c6' },
  ];

  // Calculate cumulative percentages for the conic gradient
  let cumulative = 0;
  const gradientStops = languages.map(lang => {
    const start = cumulative;
    cumulative += lang.percent;
    return `${lang.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <Card style={{ padding: 'var(--spacing-lg)' }}>
      <h4 style={{ margin: '0 0 var(--spacing-lg) 0', fontSize: '1rem', color: 'var(--color-text-main)' }}>Most Used Languages</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        
        {/* Donut Chart via CSS conic-gradient */}
        <div style={{ 
            position: 'relative', 
            width: '120px', height: '120px', 
            borderRadius: '50%', 
            background: `conic-gradient(${gradientStops})`,
            boxShadow: 'var(--shadow-neu-outer-sm)'
        }}>
            {/* Inner circle to make it a donut */}
            <div style={{ 
                position: 'absolute', 
                top: '50%', left: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: '70px', height: '70px', 
                borderRadius: '50%', 
                background: 'var(--color-bg-card)',
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1)'
            }}></div>
        </div>

        {/* Legend */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {languages.map((lang, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: lang.color }}></div>
                        <span style={{ color: 'var(--color-text-main)' }}>{lang.name}</span>
                    </div>
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{lang.percent}%</span>
                </div>
            ))}
        </div>

      </div>
    </Card>
  );
};

export default LanguageChart;
