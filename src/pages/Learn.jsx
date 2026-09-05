import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { mockLessons, subjectsList } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { PlayCircle, CheckCircle } from 'lucide-react';

const Learn = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { progress, updateLessonProgress, markLessonComplete } = useApp();
  const { addToast } = useToast();

  const filteredLessons = activeFilter === 'All' 
    ? mockLessons 
    : mockLessons.filter(l => l.subject === activeFilter);

  const handleStartLesson = (lesson) => {
    updateLessonProgress(lesson.id, 10);
    addToast(`Started lesson: ${lesson.title}`, 'info');
    setSelectedLesson(null);
  };

  const handleCompleteLesson = (lesson) => {
    updateLessonProgress(lesson.id, 100);
    markLessonComplete(lesson.id);
    addToast(`Completed lesson: ${lesson.title}`, 'success');
    setSelectedLesson(null);
  };

  return (
    <>
      <div>
        <h2 style={{ color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-sm)' }}>Learn</h2>
        <p style={{ marginBottom: 'var(--spacing-md)' }}>Explore interactive lessons in your language.</p>
        
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: 'var(--spacing-lg)' }} className="hide-scrollbar">
          {subjectsList.map(subject => (
            <button
              key={subject}
              onClick={() => setActiveFilter(subject)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                background: activeFilter === subject ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: activeFilter === subject ? 'white' : 'var(--color-text-main)',
                boxShadow: activeFilter === subject ? '0 4px 10px rgba(88,86,214,0.3)' : 'var(--shadow-neu-outer-sm)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {subject}
            </button>
          ))}
        </div>

        <div className="grid-responsive">
          {filteredLessons.map(lesson => {
            const isCompleted = progress.completedLessons.includes(lesson.id);
            const currentProgress = isCompleted ? 100 : (progress.inProgressLessons[lesson.id] || 0);

            return (
              <div key={lesson.id} className="card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onClick={() => setSelectedLesson(lesson)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 'var(--fs-small)', background: 'var(--color-primary-light)', color: 'white', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                    {lesson.subject}
                  </span>
                  <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)' }}>{lesson.duration}</span>
                </div>
                <h3 style={{ margin: 'var(--spacing-md) 0 var(--spacing-xs) 0', color: 'var(--color-primary-dark)' }}>{lesson.title}</h3>
                <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', flex: 1 }}>{lesson.language}</p>
                
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-small)', marginBottom: '5px', fontWeight: 600 }}>
                    <span>Progress</span>
                    <span>{currentProgress}%</span>
                  </div>
                  <div style={{ width: '100%', background: 'var(--color-bg-input)', height: '8px', borderRadius: '4px', overflow: 'hidden', boxShadow: 'var(--shadow-neu-inner)' }}>
                    <div style={{ width: `${currentProgress}%`, background: isCompleted ? 'var(--color-success)' : 'var(--color-primary)', height: '100%', transition: 'width 0.3s ease-out' }}></div>
                  </div>
                </div>
              </div>
            )
          })}
          
          {filteredLessons.length === 0 && (
            <p style={{ color: 'var(--color-text-muted)' }}>No lessons found for this subject.</p>
          )}
        </div>
      </div>

      <Modal isOpen={!!selectedLesson} onClose={() => setSelectedLesson(null)} title={selectedLesson?.title}>
        {selectedLesson && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body)' }}>{selectedLesson.description}</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--color-bg-input)', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-small)', fontWeight: 600, border: '1px solid white' }}>📚 {selectedLesson.subject}</span>
              <span style={{ background: 'var(--color-bg-input)', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-small)', fontWeight: 600, border: '1px solid white' }}>⏱️ {selectedLesson.duration}</span>
              <span style={{ background: 'var(--color-bg-input)', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-small)', fontWeight: 600, border: '1px solid white' }}>🌐 {selectedLesson.language}</span>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
              {(!progress.inProgressLessons[selectedLesson.id] && !progress.completedLessons.includes(selectedLesson.id)) ? (
                <Button variant="primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={() => handleStartLesson(selectedLesson)}>
                  <PlayCircle size={20} /> Start Lesson
                </Button>
              ) : progress.completedLessons.includes(selectedLesson.id) ? (
                 <Button variant="primary" style={{ flex: 1, background: 'var(--color-success)', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={() => { setSelectedLesson(null); addToast('Lesson is already complete!', 'success') }}>
                  <CheckCircle size={20} /> Review Lesson
                </Button>
              ) : (
                <>
                  <Button variant="secondary" style={{ flex: 1 }} onClick={() => handleStartLesson(selectedLesson)}>
                    Continue
                  </Button>
                  <Button variant="primary" style={{ flex: 1 }} onClick={() => handleCompleteLesson(selectedLesson)}>
                    Complete
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default Learn;
