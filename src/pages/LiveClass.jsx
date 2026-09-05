import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { Video, Calendar, Clock, Users, Play } from 'lucide-react';

const LiveClass = () => {
  const { addToast } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  const upcomingClasses = [
    { id: 1, title: 'Introduction to Fractions', subject: 'Mathematics', teacher: 'Mr. Sharma', time: '10:00 AM Today', students: 45, language: 'Hindi' },
    { id: 2, title: 'The Water Cycle', subject: 'Science', teacher: 'Mrs. Gupta', time: '2:00 PM Today', students: 38, language: 'Hindi' },
  ];

  const handleJoin = (id) => {
    setIsJoining(id);
    setTimeout(() => {
      addToast('Joining live classroom environment...', 'info');
      setIsJoining(null);
    }, 1000);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ alignSelf: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
          <h2 style={{ color: 'var(--color-primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video /> Live Classes
          </h2>
          <p>Join interactive real-time translated classes.</p>
        </div>

        <div className="grid-responsive" style={{ width: '100%' }}>
          {upcomingClasses.map(cls => (
            <Card key={cls.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                <span style={{ fontSize: 'var(--fs-small)', background: 'var(--color-primary-light)', color: 'white', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                  {cls.subject}
                </span>
                <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-primary-dark)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-bg-page)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                  <Users size={14} /> {cls.students}
                </span>
              </div>
              
              <h3 style={{ color: 'var(--color-text-main)', margin: '0 0 var(--spacing-xs) 0' }}>{cls.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)', margin: '0 0 var(--spacing-md) 0' }}>by {cls.teacher}</p>

              <div className="card-inner" style={{ padding: 'var(--spacing-md)', marginTop: 'auto', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-text-main)', fontSize: 'var(--fs-small)', fontWeight: 500 }}>
                  <Calendar size={16} color="var(--color-primary)" /> Today
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-text-main)', fontSize: 'var(--fs-small)', fontWeight: 500 }}>
                  <Clock size={16} color="var(--color-primary)" /> {cls.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)', fontSize: 'var(--fs-small)', fontWeight: 500 }}>
                  <span style={{ fontSize: '16px' }}>🌐</span> Translated to: {cls.language}
                </div>
              </div>

              <Button 
                variant="primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }} 
                onClick={() => handleJoin(cls.id)}
                disabled={isJoining === cls.id}
              >
                {isJoining === cls.id ? 'Connecting...' : <><Play size={18} /> Join Class</>}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default LiveClass;
