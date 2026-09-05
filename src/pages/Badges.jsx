import React, { useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { mockBadges } from '../data/mockData';
import { Lock } from 'lucide-react';

const Badges = () => {
  const { progress } = useApp();
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badges = mockBadges.map(badge => ({
    ...badge,
    unlocked: progress.unlockedBadges.includes(badge.name) || badge.unlocked
  }));

  return (
    <>
      <div>
        <h2 style={{ color: 'var(--color-primary-dark)', margin: 0, marginBottom: 'var(--spacing-sm)' }}>My Badges</h2>
        <p style={{ marginBottom: 'var(--spacing-lg)' }}>Earn badges by completing lessons and streaks!</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--spacing-md)' }}>
          {badges.map(badge => (
            <Card 
              key={badge.id} 
              style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', 
                cursor: 'pointer', opacity: badge.unlocked ? 1 : 0.6,
                background: badge.unlocked ? 'var(--color-bg-card)' : 'var(--color-bg-input)',
                border: badge.unlocked ? '1px solid rgba(255,255,255,0.8)' : 'none',
                boxShadow: badge.unlocked ? 'var(--shadow-neu-outer)' : 'var(--shadow-neu-inner)'
              }}
              onClick={() => setSelectedBadge(badge)}
            >
              <div style={{ 
                width: '64px', height: '64px', 
                background: badge.unlocked ? `${badge.color}20` : 'rgba(0,0,0,0.05)', 
                borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 'var(--spacing-md)',
                boxShadow: badge.unlocked ? 'var(--shadow-neu-inner)' : 'none'
              }}>
                {badge.unlocked ? (
                  <span style={{ fontSize: '1.75rem', color: badge.color }}>{badge.icon}</span>
                ) : (
                  <Lock size={24} color="var(--color-text-muted)" />
                )}
              </div>
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-primary-dark)' }}>{badge.name}</h4>
              {badge.unlocked && <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)' }}>{badge.date}</span>}
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selectedBadge} onClose={() => setSelectedBadge(null)} title={selectedBadge?.name}>
        {selectedBadge && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{ 
                width: '96px', height: '96px', 
                background: selectedBadge.unlocked ? `${selectedBadge.color}20` : 'rgba(0,0,0,0.05)', 
                borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-neu-inner)'
              }}>
                {selectedBadge.unlocked ? (
                  <span style={{ fontSize: '2.5rem', color: selectedBadge.color }}>{selectedBadge.icon}</span>
                ) : (
                  <Lock size={32} color="var(--color-text-muted)" />
                )}
            </div>
            {selectedBadge.unlocked ? (
              <>
                <p style={{ color: 'var(--color-text-main)', fontSize: 'var(--fs-body)', fontWeight: 600 }}>{selectedBadge.description}</p>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)' }}>Earned on {selectedBadge.date}</span>
              </>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body)' }}>Complete more lessons and activities to unlock this badge!</p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Badges;
