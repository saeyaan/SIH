import React from 'react';
import DailySchedule from './DailySchedule';
import ClassroomOverview from './ClassroomOverview';
import LanguageChart from './LanguageChart';
import MotivationBanner from './MotivationBanner';

const TeacherRightPanel = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', height: '100%' }}>
      <DailySchedule />
      <ClassroomOverview />
      <LanguageChart />
      
      <div style={{ marginTop: 'auto' }}>
        <MotivationBanner />
      </div>
    </div>
  );
};

export default TeacherRightPanel;
