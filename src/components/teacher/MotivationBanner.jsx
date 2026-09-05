import React from 'react';
import Card from '../Card';
import { Leaf } from 'lucide-react';

const MotivationBanner = () => {
  return (
    <Card style={{ background: 'var(--grad-blue)', border: 'none', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Leaf size={18} color="var(--color-primary)" />
        </div>
        <h3 style={{ color: 'var(--color-primary-dark)', fontSize: '1.1rem', margin: '0 0 8px 0', lineHeight: 1.2 }}>
            Small Steps.<br />Big Learning.
        </h3>
        <p style={{ color: 'var(--color-primary-dark)', opacity: 0.8, fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
            Your efforts are making education more inclusive and accessible for every child.
        </p>
      </div>

      {/* Subtle Landscape Illustration (CSS Shapes) */}
      <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.4 }}>
        <div style={{ position: 'absolute', bottom: '10px', right: '30px', width: '80px', height: '80px', background: 'var(--color-primary-light)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '0', right: '-10px', width: '120px', height: '60px', background: 'var(--color-primary)', borderRadius: '60px 60px 0 0' }}></div>
        <div style={{ position: 'absolute', bottom: '0', right: '60px', width: '90px', height: '40px', background: '#3b389f', borderRadius: '40px 40px 0 0' }}></div>
      </div>
    </Card>
  );
};

export default MotivationBanner;
