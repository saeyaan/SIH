import React from 'react';
import { FileText, Languages, Sparkles, Video, BarChart2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionCards = () => {
  const navigate = useNavigate();

  const actions = [
    { 
        title: 'Create Lesson', 
        desc: 'Upload or write new content', 
        icon: FileText, 
        color: '#5856d6', 
        bg: 'var(--color-pastel-blue)',
        path: '/teacher/create'
    },
    { 
        title: 'Translate Content', 
        desc: 'Convert to multiple languages', 
        icon: Languages, 
        color: '#34c759', 
        bg: 'var(--color-pastel-mint)',
        path: '/teacher/translate'
    },
    { 
        title: 'Simplify with AI', 
        desc: 'Make content easy for young learners', 
        icon: Sparkles, 
        color: '#ff3b30', 
        bg: 'var(--color-pastel-pink)',
        path: '/teacher/simplify'
    },
    { 
        title: 'Start Live Class', 
        desc: 'Teach with live translation', 
        icon: Video, 
        color: '#ff9500', 
        bg: 'var(--color-pastel-yellow)',
        path: '/teacher/live'
    },
    { 
        title: 'View Analytics', 
        desc: 'Understand your classroom better', 
        icon: BarChart2, 
        color: '#8e44ad', 
        bg: 'var(--color-pastel-lavender)',
        path: '/teacher/analytics'
    },
  ];

  return (
    <div className="grid-cols-5" style={{ marginBottom: 'var(--spacing-xxl)' }}>
      {actions.map((action, idx) => (
        <div 
            key={idx} 
            className="card" 
            style={{ 
                background: action.bg, 
                border: 'none', 
                display: 'flex', 
                flexDirection: 'column', 
                cursor: 'pointer',
                padding: 'var(--spacing-md)'
            }}
            onClick={() => navigate(action.path)}
        >
            <div style={{ 
                background: 'rgba(255,255,255,0.7)', 
                width: '42px', height: '42px', 
                borderRadius: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px',
                boxShadow: 'var(--shadow-soft)'
            }}>
                <action.icon size={22} color={action.color} />
            </div>
            
            <h4 style={{ color: 'var(--color-text-main)', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700 }}>{action.title}</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0, flex: 1, lineHeight: 1.3 }}>{action.desc}</p>
            
            <div style={{ alignSelf: 'flex-end', marginTop: '12px' }}>
                <ArrowRight size={16} color="var(--color-text-main)" style={{ opacity: 0.5 }} />
            </div>
        </div>
      ))}
    </div>
  );
};

export default QuickActionCards;
