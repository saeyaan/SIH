import React from 'react';
import TeacherHeader from '../components/teacher/TeacherHeader';

const TeacherPageWrapper = ({ title, children }) => {
  return (
    <>
      <TeacherHeader />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        {title && <h2 style={{ color: 'var(--color-primary-dark)', margin: 0 }}>{title}</h2>}
        {children ? (
          children
        ) : (
          <div className="card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <p>This is a placeholder page for <strong>{title}</strong>.</p>
            <p>Component implementation coming soon.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherPageWrapper;
