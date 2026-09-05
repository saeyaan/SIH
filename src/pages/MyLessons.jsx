import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { mockLessons } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const MyLessons = () => {
  const { progress } = useApp();
  const navigate = useNavigate();

  const myLessons = mockLessons.filter(lesson => 
    progress.completedLessons.includes(lesson.id) || 
    progress.inProgressLessons[lesson.id] !== undefined
  );

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <div>
            <h2 style={{ color: 'var(--color-primary-dark)', margin: 0 }}>My Lessons</h2>
            <p style={{ margin: 0, fontSize: 'var(--fs-small)' }}>Continue where you left off</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/learn')}>Find More</Button>
        </div>

        {myLessons.length === 0 ? (
          <div style={{ marginTop: 'var(--spacing-xxl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <p style={{ marginBottom: 'var(--spacing-md)' }}>You haven't started any lessons yet.</p>
            <Button variant="primary" onClick={() => navigate('/learn')}>
              Start Learning
            </Button>
          </div>
        ) : (
          <div className="grid-responsive">
            {myLessons.map(lesson => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              const currentProgress = isCompleted ? 100 : (progress.inProgressLessons[lesson.id] || 0);

              return (
                <div key={lesson.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 'var(--fs-small)', background: 'var(--color-primary-light)', color: 'white', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                      {lesson.subject}
                    </span>
                    {isCompleted && <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-success)', fontWeight: 600 }}>Completed</span>}
                  </div>
                  <h3 style={{ margin: 'var(--spacing-md) 0 var(--spacing-xs) 0', color: 'var(--color-primary-dark)' }}>{lesson.title}</h3>
                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>{lesson.language} • {lesson.duration}</p>
                  
                  <div className="card-inner" style={{ marginTop: 'auto', padding: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-small)', marginBottom: '8px', fontWeight: 600 }}>
                      <span>Progress</span>
                      <span>{currentProgress}%</span>
                    </div>
                    <div style={{ width: '100%', background: 'var(--color-bg-page)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: 'var(--spacing-md)', boxShadow: 'var(--shadow-neu-inner)' }}>
                      <div style={{ width: `${currentProgress}%`, background: isCompleted ? 'var(--color-success)' : 'var(--color-primary)', height: '100%', transition: 'width 0.3s ease' }}></div>
                    </div>
                    <Button variant={isCompleted ? 'secondary' : 'primary'} style={{ width: '100%' }} onClick={() => navigate('/learn')}>
                      {isCompleted ? 'Review Lesson' : 'Continue Learning'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyLessons;
