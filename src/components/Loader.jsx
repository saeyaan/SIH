import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '1rem' }}>
      <Loader2 size={32} color="var(--color-primary)" className="spin-animation" />
      <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{text}</span>
    </div>
  );
};

export default Loader;
